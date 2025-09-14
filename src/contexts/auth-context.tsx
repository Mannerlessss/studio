'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { 
    User, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction, arrayUnion, addDoc, increment, DocumentReference } from 'firebase/firestore';

export interface Investment {
    id: string;
    planAmount: number;
    dailyReturn: number;
    startDate: Timestamp;
    lastUpdate: Timestamp;
    durationDays: number;
    earnings: number;
    status: 'active' | 'completed';
}

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    referredBy?: string;
    commissionParent?: string; // UID of the user who gets commission
    investedReferralCount: number;
    referrals?: any[]; // Array of referred user objects
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    totalInvested: number; // Sum of all planAmounts
    totalEarnings: number; // Sum of all earnings types
    totalReferralEarnings: number;
    totalBonusEarnings: number;
    totalInvestmentEarnings: number; // Sum of earnings from all investment plans

    hasInvested: boolean;
    hasCollectedSignupBonus: boolean;
    lastBonusClaim?: Timestamp;
    claimedMilestones?: number[];
    redeemedOfferCodes?: string[];
    createdAt: any;
    lastLogin: any;
    investments?: Investment[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  totalROI: number;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  collectSignupBonus: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const totalROI = useMemo(() => {
        if (!userData || !userData.investments) return 0;
        const totalInvestedInActivePlans = userData.investments
            .filter(inv => inv.status === 'active')
            .reduce((acc, inv) => acc + inv.planAmount, 0);
        return totalInvestedInActivePlans * 3; // 300% ROI
    }, [userData]);


    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            sessionStorage.removeItem('vaultboost-announcement-seen');
        } catch (error) {
            console.error("Error signing out: ", error);
        } finally {
            setUser(null);
            setUserData(null);
            setIsAdmin(false);
            router.push('/login');
            setLoading(false); // Ensure loading is false after redirect
        }
    };

    // Function to process earnings for all active investments for a user
    const processInvestmentEarnings = async (currentUserId: string) => {
        if (!currentUserId) return;
        
        try {
            await runTransaction(db, async (transaction) => {
                // Phase 1: READS
                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    console.warn("processInvestmentEarnings: User document not found.");
                    return;
                }
                const currentData = userDoc.data() as UserData;

                const commissionParentRef = currentData.commissionParent ? doc(db, 'users', currentData.commissionParent) : null;
                const commissionParentDoc = commissionParentRef ? await transaction.get(commissionParentRef) : null;

                const investmentsColRef = collection(db, `users/${currentUserId}/investments`);
                const activeInvestmentsQuery = query(investmentsColRef, where('status', '==', 'active'));
                const activeInvestmentsSnapshot = await getDocs(activeInvestmentsQuery); // This is outside transaction but fine for a query
                
                const investmentDocsToUpdate: { ref: DocumentReference, data: Investment }[] = [];
                for(const doc of activeInvestmentsSnapshot.docs) {
                    investmentDocsToUpdate.push({ref: doc.ref, data: doc.data() as Investment});
                }
                
                // Phase 2: CALCULATIONS
                let totalEarningsToAdd = 0;
                let totalCommissionToAdd = 0;
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const writeOps: any[] = [];
                
                for (const investmentDoc of investmentDocsToUpdate) {
                    const investment = investmentDoc.data;
                    const investmentRef = investmentDoc.ref;

                    const lastUpdateDate = investment.lastUpdate.toDate();
                    const startOfLastUpdateDay = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate());
                    
                    const msInDay = 24 * 60 * 60 * 1000;
                    const daysPassed = Math.floor((startOfToday.getTime() - startOfLastUpdateDay.getTime()) / msInDay);
                    
                    if (daysPassed <= 0) continue;

                    const dailyReturn = investment.dailyReturn;
                    const durationDays = investment.durationDays;
                    if (!dailyReturn || !durationDays) continue;

                    const daysAlreadyProcessed = Math.round((investment.earnings || 0) / dailyReturn);
                    const remainingDaysInPlan = durationDays - daysAlreadyProcessed;
                    const daysToCredit = Math.min(daysPassed, remainingDaysInPlan);

                    if (daysToCredit > 0) {
                        const earningsForThisPlan = dailyReturn * daysToCredit;
                        totalEarningsToAdd += earningsForThisPlan;

                        const newEarnings = (investment.earnings || 0) + earningsForThisPlan;
                        const newStatus = (daysAlreadyProcessed + daysToCredit) >= durationDays ? 'completed' : 'active';
                        
                        writeOps.push({ type: 'update', ref: investmentRef, data: { earnings: newEarnings, lastUpdate: serverTimestamp(), status: newStatus } });

                        for (let i = 0; i < daysToCredit; i++) {
                            const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                            const earningDay = new Date(startOfToday.getTime() - (daysPassed - i - 1) * msInDay);
                            writeOps.push({ type: 'set', ref: transactionRef, data: { type: 'earning', amount: dailyReturn, description: `Earning from Plan ${investment.planAmount}`, status: 'Completed', date: Timestamp.fromDate(earningDay) } });
                        }

                        if (commissionParentDoc && commissionParentDoc.exists()) {
                            const commissionAmount = earningsForThisPlan * 0.03;
                            totalCommissionToAdd += commissionAmount;
                        }
                    }
                }
                
                // Phase 3: WRITES
                if (totalEarningsToAdd > 0) {
                    transaction.update(userDocRef, { totalInvestmentEarnings: increment(totalEarningsToAdd), totalBalance: increment(totalEarningsToAdd), totalEarnings: increment(totalEarningsToAdd) });
                }
    
                if (totalCommissionToAdd > 0 && commissionParentRef) {
                    transaction.update(commissionParentRef, { totalBalance: increment(totalCommissionToAdd), totalReferralEarnings: increment(totalCommissionToAdd), totalEarnings: increment(totalCommissionToAdd) });
                    const commissionTransactionRef = doc(collection(db, `users/${commissionParentRef.id}/transactions`));
                    transaction.set(commissionTransactionRef, { type: 'referral', amount: totalCommissionToAdd, description: `3% commission from ${currentData.name}`, status: 'Completed', date: serverTimestamp() });
                }

                for (const op of writeOps) {
                    if (op.type === 'update') {
                        transaction.update(op.ref, op.data);
                    } else if (op.type === 'set') {
                        transaction.set(op.ref, op.data);
                    }
                }
            });
        } catch (error) {
            console.error("Error processing investment earnings transaction: ", error);
        }
    };

    useEffect(() => {
        let unsubFromUser: (() => void) | undefined;
        let unsubFromInvestments: (() => void) | undefined;
        let authTimeout: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            clearTimeout(authTimeout); 
            if (unsubFromUser) unsubFromUser();
            if (unsubFromInvestments) unsubFromInvestments();
            
            if (currentUser) {
                await processInvestmentEarnings(currentUser.uid);
                
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                     setUserData(null);
                     setLoading(false);
                } else {
                    
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    unsubFromUser = onSnapshot(userDocRef, (userDocSnap) => {
                        if (!userDocSnap.exists()) {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. Waiting...`);
                            return;
                        }
                        
                        const baseUserData = { uid: userDocSnap.id, ...userDocSnap.data() } as UserData;
                        
                        const investmentsColRef = collection(db, `users/${currentUser.uid}/investments`);
                        unsubFromInvestments = onSnapshot(investmentsColRef, (investmentsSnap) => {
                            const investments = investmentsSnap.docs.map(docSnap => {
                                const data = docSnap.data();
                                return {
                                    id: docSnap.id,
                                    ...data,
                                } as Investment;
                            });
                            setUserData({ ...baseUserData, investments });
                            setLoading(false);
                        }, (error) => {
                            console.error("Error fetching investments:", error);
                            setUserData(baseUserData);
                            setLoading(false);
                        });

                    }, (error) => {
                        console.error("Error fetching user data:", error);
                        toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile. Logging out." });
                        logOut();
                    });
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        authTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth state change timed out. Forcing loading to false.");
                setLoading(false);
            }
        }, 10000); 

        return () => {
            if (unsubFromUser) unsubFromUser();
            if (unsubFromInvestments) unsubFromInvestments();
            unsubscribe();
            clearTimeout(authTimeout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

     useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/login' || pathname.startsWith('/ref/');
        const isAdminPage = pathname.startsWith('/admin');

        if (!user && !isAuthPage) {
            router.push('/login');
        } else if (user && isAuthPage) {
            router.push(isAdmin ? '/admin' : '/');
        } else if (user && !isAdmin && isAdminPage) {
             router.push('/');
        } else if (user && isAdmin && !isAdminPage) {
            router.push('/admin');
        }
    }, [user, isAdmin, loading, pathname, router]);

    const signInWithGoogle = async () => {
        // To be implemented if needed
    };

    const signUpWithEmail = async ({ name, email, phone, password, referralCode: providedCode }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            const referralCode = `${name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
            const userDocRef = doc(db, 'users', newUser.uid);

            const newUserDocData: any = {
                uid: newUser.uid,
                name,
                email,
                phone,
                membership: 'Basic',
                totalBalance: 0,
                totalInvested: 0,
                totalEarnings: 0,
                totalReferralEarnings: 0,
                totalBonusEarnings: 0,
                totalInvestmentEarnings: 0,
                hasInvested: false,
                hasCollectedSignupBonus: false,
                investedReferralCount: 0,
                referralCode: referralCode,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
                redeemedOfferCodes: [],
            };

            const usedCode = localStorage.getItem('referralCode') || providedCode;
            if (usedCode) {
                const q = query(collection(db, 'users'), where('referralCode', '==', usedCode.toUpperCase()));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const referrerDoc = querySnapshot.docs[0];
                    newUserDocData.usedReferralCode = usedCode.toUpperCase();
                    newUserDocData.referredBy = referrerDoc.id;
                }
            }
             
            await setDoc(userDocRef, newUserDocData);

            if (newUserDocData.referredBy) {
                const referrerId = newUserDocData.referredBy;
                 if (referrerId !== newUser.uid) {
                    const referrerSubCollectionRef = collection(db, `users/${referrerId}/referrals`);
                    await addDoc(referrerSubCollectionRef, {
                        userId: newUser.uid,
                        name: name,
                        email: email,
                        hasInvested: false,
                        joinedAt: Timestamp.now(),
                    });
                    localStorage.removeItem('referralCode');
                }
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error.message,
            });
            setLoading(false);
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', credential.user.uid);
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message,
            });
             setLoading(false);
        }
    };

    const sendPasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Password Reset Link Sent',
                description: `If an account with ${email} exists, a reset link has been sent.`,
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        }
    };
    
    const updateUserName = async (name: string) => {
        if (!user) throw new Error("User not found");
        await updateDoc(doc(db, 'users', user.uid), { name });
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("User not found");
        await updateDoc(doc(db, 'users', user.uid), { phone });
    };
    
    const claimDailyBonus = async (amount: number) => {
        if (!user || !userData) throw new Error("User not found");

        const now = Timestamp.now();
        if (userData.lastBonusClaim) {
            const fourHours = 4 * 60 * 60 * 1000;
            const lastClaimMillis = userData.lastBonusClaim.toMillis();
            if (now.toMillis() - lastClaimMillis < fourHours) {
                throw new Error("You have already claimed your bonus recently.");
            }
        }
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: userData.totalBalance + amount,
            totalBonusEarnings: userData.totalBonusEarnings + amount,
            totalEarnings: userData.totalEarnings + amount,
            lastBonusClaim: now
        });
        
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        batch.set(transactionRef, {
            type: 'bonus',
            amount: amount,
            description: 'Daily Bonus Claim',
            status: 'Completed',
            date: now
        });

        await batch.commit();
        toast({ title: 'Bonus Claimed!', description: `You received ${amount} Rs.` });
    };

    const collectSignupBonus = async () => {
        if (!user || !userData) throw new Error("User not found");
        if (userData.hasCollectedSignupBonus) throw new Error("Sign-up bonus already collected.");

        const signupBonusAmount = 200;
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: userData.totalBalance + signupBonusAmount,
            totalBonusEarnings: userData.totalBonusEarnings + signupBonusAmount,
            totalEarnings: userData.totalEarnings + signupBonusAmount,
            hasCollectedSignupBonus: true,
        });
        
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        batch.set(transactionRef, {
            type: 'bonus',
            amount: signupBonusAmount,
            description: 'Sign-up Bonus',
            status: 'Completed',
            date: serverTimestamp()
        });

        await batch.commit();
        toast({ title: 'Bonus Collected!', description: `You received ${signupBonusAmount} Rs.` });
    }

    const value: AuthContextType = {
        user,
        userData,
        loading,
        isAdmin,
        totalROI,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        updateUserPhone,
        updateUserName,
        claimDailyBonus,
        collectSignupBonus,
        sendPasswordReset,
    };
    
    if (loading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
