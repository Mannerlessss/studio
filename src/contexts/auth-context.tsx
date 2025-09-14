
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
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction, arrayUnion, addDoc, increment } from 'firebase/firestore';

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
        const investmentsColRef = collection(db, `users/${currentUserId}/investments`);
        const activeInvestmentsQuery = query(investmentsColRef, where('status', '==', 'active'));
        
        try {
            // First, get all active investments outside of a transaction.
            const activeInvestmentsSnapshot = await getDocs(activeInvestmentsQuery);

            if (activeInvestmentsSnapshot.empty) {
                return; // No active investments to process
            }

            // Now, run a transaction to update user and investment docs together.
             await runTransaction(db, async (transaction) => {
                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    console.warn("processInvestmentEarnings: User document not found.");
                    return;
                }
                
                let totalEarningsToAdd = 0;
                const currentData = userDoc.data() as UserData;
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                const commissionParentRef = currentData.commissionParent ? doc(db, 'users', currentData.commissionParent) : null;
                let commissionParentDoc: any = null;
                if(commissionParentRef){
                    commissionParentDoc = await transaction.get(commissionParentRef);
                }


                for (const investmentDoc of activeInvestmentsSnapshot.docs) {
                    // We must re-fetch inside the transaction to ensure we have the latest data
                    const currentInvestmentRef = doc(db, `users/${currentUserId}/investments`, investmentDoc.id);
                    const currentInvestmentDoc = await transaction.get(currentInvestmentRef);

                    if (!currentInvestmentDoc.exists()) continue;

                    const investment = currentInvestmentDoc.data() as Investment;

                    const lastUpdateDate = investment.lastUpdate.toDate();
                    const startOfLastUpdateDay = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate());
                    
                    const msInDay = 24 * 60 * 60 * 1000;
                    const daysPassed = Math.floor((startOfToday.getTime() - startOfLastUpdateDay.getTime()) / msInDay);
                    
                    if (daysPassed <= 0) continue;
                    
                    const dailyReturn = investment.dailyReturn || 0;
                    if (dailyReturn <= 0) continue; // Skip if no daily return

                    const daysAlreadyProcessed = Math.round(investment.earnings / dailyReturn);
                    const remainingDaysInPlan = investment.durationDays - daysAlreadyProcessed;
                    const daysToCredit = Math.min(daysPassed, remainingDaysInPlan);

                    if (daysToCredit > 0) {
                        const earningsForThisPlan = dailyReturn * daysToCredit;
                        totalEarningsToAdd += earningsForThisPlan;

                        const newEarnings = investment.earnings + earningsForThisPlan;
                        const newStatus = (daysAlreadyProcessed + daysToCredit) >= investment.durationDays ? 'completed' : 'active';
                        
                        transaction.update(currentInvestmentRef, {
                            earnings: newEarnings,
                            lastUpdate: serverTimestamp(),
                            status: newStatus
                        });

                        for (let i = 0; i < daysToCredit; i++) {
                            const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                            const earningDay = new Date(startOfToday.getTime() - (daysPassed - i - 1) * msInDay);
                            transaction.set(transactionRef, {
                                type: 'earning',
                                amount: dailyReturn,
                                description: `Earning from Plan ${investment.planAmount}`,
                                status: 'Completed',
                                date: Timestamp.fromDate(earningDay),
                            });
                        }

                        // Handle lifetime commission
                        if (commissionParentDoc && commissionParentDoc.exists()) {
                            const commissionAmount = earningsForThisPlan * 0.03;
                            const parentData = commissionParentDoc.data();
                            transaction.update(commissionParentRef!, {
                                totalBalance: (parentData.totalBalance || 0) + commissionAmount,
                                totalReferralEarnings: (parentData.totalReferralEarnings || 0) + commissionAmount,
                                totalEarnings: (parentData.totalEarnings || 0) + commissionAmount,
                            });
                            
                            const commissionTransactionRef = doc(collection(db, `users/${commissionParentRef!.id}/transactions`));
                            transaction.set(commissionTransactionRef, {
                                type: 'referral',
                                amount: commissionAmount,
                                description: `3% commission from ${currentData.name}`,
                                status: 'Completed',
                                date: serverTimestamp(),
                            });
                        }
                    }
                }

                if (totalEarningsToAdd > 0) {
                    transaction.update(userDocRef, {
                        totalInvestmentEarnings: (currentData.totalInvestmentEarnings || 0) + totalEarningsToAdd,
                        totalBalance: (currentData.totalBalance || 0) + totalEarningsToAdd,
                        totalEarnings: (currentData.totalEarnings || 0) + totalEarningsToAdd,
                    });
                }
            });
        } catch (error) {
             if (String(error).includes("document does not exist")) {
                console.warn("processInvestmentEarnings failed because user document doesn't exist. This is expected during signup race conditions.");
            } else {
                console.error("Error processing investment earnings: ", error);
            }
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
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                     setUserData(null);
                     setLoading(false);
                } else {
                    // Process earnings ONCE before setting up listeners
                    await processInvestmentEarnings(currentUser.uid); 
                    
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    unsubFromUser = onSnapshot(userDocRef, (userDocSnap) => {
                        if (!userDocSnap.exists()) {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. Waiting...`);
                            return;
                        }
                        
                        const baseUserData = { uid: userDocSnap.id, ...userDocSnap.data() } as UserData;
                        
                        // Now listen to investments subcollection
                        const investmentsColRef = collection(db, `users/${currentUser.uid}/investments`);
                        unsubFromInvestments = onSnapshot(investmentsColRef, (investmentsSnap) => {
                            const investments = investmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
                            setUserData({ ...baseUserData, investments });
                            setLoading(false);
                        }, (error) => {
                            console.error("Error fetching investments:", error);
                            toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load investments. Check Firestore rules." });
                            setUserData(baseUserData); // Set base data even if investments fail
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
            // Step 1: Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Step 2: Create User Doc
            const referralCode = `${name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
            const userDocRef = doc(db, 'users', newUser.uid);

            const newUserDocData: any = {
                uid: newUser.uid,
                name,
                email,
                phone,
                membership: 'Basic',
                rank: 'Bronze',
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


            // Step 3: If referral code was used, add to referrer's subcollection
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
        if (!user || !userData) {
            toast({ variant: 'destructive', title: "Claim Failed", description: "You must be logged in to claim a bonus." });
            return;
        }

        const now = Timestamp.now();
        if (userData.lastBonusClaim) {
            const fourHours = 4 * 60 * 60 * 1000;
            const lastClaimMillis = userData.lastBonusClaim.toMillis();
            if (now.toMillis() - lastClaimMillis < fourHours) {
                toast({ variant: 'destructive', title: "Too Soon!", description: "You can only claim a bonus every 4 hours." });
                return;
            }
        }
        
        try {
            const batch = writeBatch(db);
            const userDocRef = doc(db, 'users', user.uid);
            
            batch.update(userDocRef, {
                totalBalance: increment(amount),
                totalBonusEarnings: increment(amount),
                totalEarnings: increment(amount),
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
        } catch (error: any) {
            console.error("Error claiming daily bonus: ", error);
            toast({ variant: 'destructive', title: 'Claim Failed', description: error.message });
        }
    };

    const collectSignupBonus = async () => {
         if (!user || !userData) {
            toast({ variant: 'destructive', title: "Collect Failed", description: "You must be logged in." });
            return;
        }
        if (userData.hasCollectedSignupBonus) {
            toast({ variant: 'destructive', title: "Already Collected", description: "Sign-up bonus has already been collected." });
            return;
        }

        const signupBonusAmount = 200;
        
        try {
            const batch = writeBatch(db);
            const userDocRef = doc(db, 'users', user.uid);
            
            batch.update(userDocRef, {
                totalBalance: increment(signupBonusAmount),
                totalBonusEarnings: increment(signupBonusAmount),
                totalEarnings: increment(signupBonusAmount),
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
        } catch (error: any) {
            console.error("Error collecting signup bonus: ", error);
            toast({ variant: 'destructive', title: 'Collect Failed', description: error.message });
        }
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
