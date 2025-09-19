
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
import { useToast } from '@/hooks/use-toast';
import { clientAuth, clientDb } from '@/lib/firebaseClient';
import { doc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction, addDoc, increment, getDoc } from 'firebase/firestore';
import { redeemCode as redeemReferralCodeFlow } from '@/ai/flows/redeem-code-flow';
import { Gem } from 'lucide-react';
import { redeemOfferCode as redeemOfferCodeFlow } from '@/ai/flows/redeem-offer-code-flow';


export interface Investment {
    id: string;
    planAmount: number;
    dailyReturn: number;
    startDate: Timestamp;
    lastUpdate: Timestamp;
    durationDays: number;
    daysProcessed: number;
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
    totalInvestmentEarnings: number;

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
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  collectSignupBonus: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
  redeemOfferCode: (code: string) => Promise<void>;
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
            await signOut(clientAuth);
            sessionStorage.removeItem('vaultboost-announcement-seen');
            sessionStorage.removeItem('vaultboost-special-offer-10k-seen');
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
    const processInvestmentEarnings = async (currentUserId: string, isPro: boolean) => {
        const investmentsColRef = collection(clientDb, `users/${currentUserId}/investments`);
        const activeInvestmentsQuery = query(investmentsColRef, where('status', '==', 'active'));
        
        try {
            const activeInvestmentsSnapshot = await getDocs(activeInvestmentsQuery);
            if (activeInvestmentsSnapshot.empty) return;

             await runTransaction(clientDb, async (transaction) => {
                const userDocRef = doc(clientDb, 'users', currentUserId);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    console.warn("processInvestmentEarnings: User document not found.");
                    return;
                }
                
                let totalEarningsToAdd = 0;
                const currentData = userDoc.data() as UserData;
                
                const commissionParentRef = currentData.commissionParent ? doc(clientDb, 'users', currentData.commissionParent) : null;
                let commissionParentDoc: any = null;
                if(commissionParentRef){
                    commissionParentDoc = await transaction.get(commissionParentRef);
                }


                for (const investmentDoc of activeInvestmentsSnapshot.docs) {
                    const currentInvestmentRef = doc(clientDb, `users/${currentUserId}/investments`, investmentDoc.id);
                    const currentInvestmentDoc = await transaction.get(currentInvestmentRef);

                    if (!currentInvestmentDoc.exists()) continue;

                    const investment = currentInvestmentDoc.data() as Investment;

                    const now = new Date();
                    const lastUpdateDate = investment.lastUpdate.toDate();

                    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const startOfLastUpdateDay = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate());

                    const msInDay = 24 * 60 * 60 * 1000;
                    const daysPassed = Math.floor((startOfToday.getTime() - startOfLastUpdateDay.getTime()) / msInDay);
                    
                    if (daysPassed <= 0) continue;
                    
                    const dailyReturnRate = isPro ? 0.20 : 0.10;
                    const correctDailyReturn = investment.planAmount * dailyReturnRate;
                    
                    const remainingDaysInPlan = investment.durationDays - investment.daysProcessed;
                    const daysToCredit = Math.min(daysPassed, remainingDaysInPlan);

                    if (daysToCredit > 0) {
                        const earningsForThisPlan = correctDailyReturn * daysToCredit;
                        totalEarningsToAdd += earningsForThisPlan;

                        const newEarnings = investment.earnings + earningsForThisPlan;
                        const newDaysProcessed = investment.daysProcessed + daysToCredit;
                        const newStatus = newDaysProcessed >= investment.durationDays ? 'completed' : 'active';
                        
                        transaction.update(currentInvestmentRef, {
                            earnings: newEarnings,
                            daysProcessed: newDaysProcessed,
                            lastUpdate: serverTimestamp(),
                            status: newStatus
                        });

                        for (let i = 0; i < daysToCredit; i++) {
                            const transactionRef = doc(collection(clientDb, `users/${currentUserId}/transactions`));
                            const earningDay = new Date(startOfLastUpdateDay.getTime() + (i + 1) * msInDay);
                            transaction.set(transactionRef, {
                                type: 'earning',
                                amount: correctDailyReturn,
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
                            
                            const commissionTransactionRef = doc(collection(clientDb, `users/${commissionParentRef!.id}/transactions`));
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

        const unsubscribe = onAuthStateChanged(clientAuth, async (currentUser) => {
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
                    const userDocRef = doc(clientDb, 'users', currentUser.uid);
                    unsubFromUser = onSnapshot(userDocRef, async (userDocSnap) => {
                        if (!userDocSnap.exists()) {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. This can happen briefly during sign up.`);
                            return;
                        }
                        
                        const baseUserData = { uid: userDocSnap.id, ...userDocSnap.data() } as UserData;
                        const isPro = baseUserData.membership === 'Pro';
                        await processInvestmentEarnings(currentUser.uid, isPro);
                        
                        const refreshedUserDoc = await getDoc(userDocRef);
                        const refreshedBaseUserData = { uid: refreshedUserDoc.id, ...refreshedUserDoc.data() } as UserData;

                        const investmentsColRef = collection(clientDb, `users/${currentUser.uid}/investments`);
                        unsubFromInvestments = onSnapshot(investmentsColRef, (investmentsSnap) => {
                            const investments = investmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
                            setUserData({ ...refreshedBaseUserData, investments });
                            setLoading(false);
                        }, (error) => {
                            console.error("Error fetching investments:", error);
                            setUserData(refreshedBaseUserData);
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

        return () => {
            if (unsubFromUser) unsubFromUser();
            if (unsubFromInvestments) unsubFromInvestments();
            unsubscribe();
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


    const signUpWithEmail = async ({ name, email, phone, password, referralCode: providedCode }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
            const newUser = userCredential.user;

            const referralCode = `${name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
            const userDocRef = doc(clientDb, 'users', newUser.uid);

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
                 const { success, message } = await redeemReferralCodeFlow({
                    userId: newUser.uid,
                    userName: name,
                    userEmail: email,
                    code: usedCode,
                });
                if(success) {
                    newUserDocData.usedReferralCode = usedCode.toUpperCase();
                }
                console.log(message);
                localStorage.removeItem('referralCode');
            }
             await setDoc(userDocRef, newUserDocData);


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
            const credential = await signInWithEmailAndPassword(clientAuth, email, password);
            const userDocRef = doc(clientDb, 'users', credential.user.uid);
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
            await sendPasswordResetEmail(clientAuth, email);
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
        await updateDoc(doc(clientDb, 'users', user.uid), { name });
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("User not found");
        await updateDoc(doc(clientDb, 'users', user.uid), { phone });
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
        
        const batch = writeBatch(clientDb);
        const userDocRef = doc(clientDb, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: increment(amount),
            totalBonusEarnings: increment(amount),
            totalEarnings: increment(amount),
            lastBonusClaim: now
        });
        
        const transactionRef = doc(collection(clientDb, `users/${user.uid}/transactions`));
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
        
        const batch = writeBatch(clientDb);
        const userDocRef = doc(clientDb, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: increment(signupBonusAmount),
            totalBonusEarnings: increment(signupBonusAmount),
            totalEarnings: increment(signupBonusAmount),
            hasCollectedSignupBonus: true,
        });
        
        const transactionRef = doc(collection(clientDb, `users/${user.uid}/transactions`));
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

    const redeemReferralCode = async (code: string) => {
        if (!user || !userData) {
            throw new Error("User data is not available.");
        }
        if (userData.usedReferralCode) {
            throw new Error("A referral code has already been used for this account.");
        }

        try {
            const result = await redeemReferralCodeFlow({
                userId: user.uid,
                userName: userData.name,
                userEmail: userData.email,
                code: code,
            });

            toast({
                title: 'Code Redeemed!',
                description: result.message,
            });
        } catch (error: any) {
            console.error("Redemption failed:", error);
            throw error; // Re-throw to be caught in the component
        }
    };

    const redeemOfferCode = async (code: string) => {
        if (!user) throw new Error("User is not authenticated.");
        try {
            const result = await redeemOfferCodeFlow({ userId: user.uid, code });
            toast({
                title: 'Success!',
                description: result.message,
            });
        } catch (error: any) {
             console.error("Offer code redemption failed:", error);
             throw error;
        }
    };


    const value: AuthContextType = {
        user,
        userData,
        loading,
        isAdmin,
        totalROI,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        updateUserPhone,
        updateUserName,
        claimDailyBonus,
        collectSignupBonus,
        sendPasswordReset,
        redeemReferralCode,
        redeemOfferCode,
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
