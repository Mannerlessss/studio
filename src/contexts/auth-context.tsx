
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction } from 'firebase/firestore';

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    referredBy?: string;
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    invested: number;
    earnings: number;
    projected: number;
    referralEarnings: number;
    bonusEarnings: number;
    investmentEarnings: number;
    hasInvested: boolean;
    hasCollectedSignupBonus: boolean;
    lastBonusClaim?: Timestamp;
    claimedMilestones?: number[];
    lastInvestmentUpdate?: Timestamp;
    createdAt: any;
    lastLogin: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  collectSignupBonus: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

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

    // Function to simulate daily investment earnings
    const processDailyEarnings = async (currentUserId: string) => {
        try {
            await runTransaction(db, async (transaction) => {
                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    console.warn("processDailyEarnings: User document not found, skipping transaction.");
                    return;
                }
                
                const data = userDoc.data() as UserData;
                if (!data.invested || data.invested <= 0 || !data.lastInvestmentUpdate) {
                    return; // No active investment to process
                }

                const now = Timestamp.now();
                
                // Total days elapsed since the investment started
                const investmentStartDate = data.lastInvestmentUpdate;
                const totalDaysSinceStart = Math.floor((now.toMillis() - investmentStartDate.toMillis()) / (1000 * 60 * 60 * 24));
                
                // Days already processed is based on current earnings
                const dailyReturnRate = data.membership === 'Pro' ? 0.13 : 0.10;
                const dailyEarning = data.invested * dailyReturnRate;
                const daysAlreadyProcessed = dailyEarning > 0 ? Math.floor((data.investmentEarnings || 0) / dailyEarning) : 0;
                
                if (daysAlreadyProcessed >= 30) return; // Cycle complete

                const daysToProcess = totalDaysSinceStart - daysAlreadyProcessed;

                if (daysToProcess <= 0) return; // No full day passed since last processing

                const daysToActuallyProcess = Math.min(daysToProcess, 30 - daysAlreadyProcessed);
                
                if (daysToActuallyProcess <= 0) return;

                const totalEarningsToAdd = dailyEarning * daysToActuallyProcess;

                const newInvestmentEarnings = (data.investmentEarnings || 0) + totalEarningsToAdd;
                const newTotalBalance = (data.totalBalance || 0) + totalEarningsToAdd;
                const newTotalEarnings = (data.earnings || 0) + totalEarningsToAdd;
                
                transaction.update(userDocRef, {
                    investmentEarnings: newInvestmentEarnings,
                    totalBalance: newTotalBalance,
                    earnings: newTotalEarnings,
                });

                for (let i = 0; i < daysToActuallyProcess; i++) {
                    const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                    // Calculate date for each transaction to avoid all having the same timestamp
                    const transactionDate = Timestamp.fromMillis(investmentStartDate.toMillis() + (daysAlreadyProcessed + i + 1) * 24 * 60 * 60 * 1000);
                    transaction.set(transactionRef, {
                        type: 'earning',
                        amount: dailyEarning,
                        description: `Investment Earning`,
                        status: 'Completed',
                        date: transactionDate,
                    });
                }
                 console.log(`Processed ${daysToActuallyProcess} day(s) of investment earnings.`);
            });
        } catch (error) {
             if (String(error).includes("document does not exist")) {
                console.warn("processDailyEarnings transaction failed because user document doesn't exist. This is expected during signup race conditions.");
            } else {
                console.error("Error processing daily earnings: ", error);
            }
        }
    };


    useEffect(() => {
        let unsubFromDoc: (() => void) | undefined;
        let authTimeout: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            clearTimeout(authTimeout); // Clear timeout if auth state changes
            if (unsubFromDoc) unsubFromDoc();
            
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                    setUserData(null);
                    setLoading(false);
                    return;
                }
                
                const userDocRef = doc(db, 'users', currentUser.uid);
                unsubFromDoc = onSnapshot(userDocRef, 
                    async (docSnap) => {
                        if (docSnap.exists()) {
                            await processDailyEarnings(currentUser.uid);
                            setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
                        } else {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. Waiting for it to be created...`);
                        }
                        setLoading(false); // Set loading to false once we get a database response (or lack thereof)
                    },
                    (error) => {
                        console.error("Error fetching user data:", error);
                        toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile. Logging out." });
                        logOut();
                    }
                );
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        // Set a timeout to force loading to false if auth takes too long
        authTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth state change timed out after 10 seconds. Forcing loading to false.");
                setLoading(false);
            }
        }, 10000); // 10 seconds

        return () => {
            if (unsubFromDoc) unsubFromDoc();
            unsubscribe();
            clearTimeout(authTimeout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

     useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/login';
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

    const signUpWithEmail = async ({ name, email, phone, password, referralCode }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // --- Step 1: Create the user document first ---
            const userDocRef = doc(db, 'users', newUser.uid);
            const newUserDoc: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin' | 'projected' | 'rank' | 'lastBonusClaim' | 'claimedMilestones' | 'lastInvestmentUpdate'> = {
                name,
                email,
                phone,
                membership: 'Basic',
                totalBalance: 0,
                invested: 0,
                earnings: 0,
                referralEarnings: 0,
                bonusEarnings: 0,
                investmentEarnings: 0,
                hasInvested: false,
                hasCollectedSignupBonus: false,
                referralCode: `${name.split(' ')[0].toUpperCase()}${(Math.random() * 9000 + 1000).toFixed(0)}`,
            };

             await setDoc(userDocRef, {
                ...newUserDoc,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
            });
            
            // --- Step 2: Handle referral logic separately after user is created ---
            if (referralCode) {
                try {
                    const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        const batch = writeBatch(db);

                        // Update new user with who referred them
                        batch.update(userDocRef, { 
                            usedReferralCode: referralCode,
                            referredBy: referrerDoc.id 
                        });
                        
                        // Add new user to referrer's subcollection
                        const referralSubcollectionRef = doc(collection(db, `users/${referrerDoc.id}/referrals`));
                        batch.set(referralSubcollectionRef, {
                            userId: newUser.uid,
                            name: name,
                            email: email,
                            hasInvested: false,
                            date: serverTimestamp()
                        });
                        
                        await batch.commit();
                    } else {
                         console.warn(`Referral code "${referralCode}" not found.`);
                    }
                } catch (referralError) {
                    // Log the error but don't fail the whole signup
                    console.error("Error processing referral code, but user was created successfully:", referralError);
                }
            }

        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error.message,
            });
            setLoading(false); // Make sure to stop loading on error
        } finally {
            // onAuthStateChanged will handle redirect and final loading state
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', credential.user.uid);
            // Use set with merge to create the doc if it's missing
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message,
            });
             setLoading(false);
        } finally {
            // onAuthStateChanged will handle redirect
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
    
    const redeemReferralCode = async (code: string) => {
        const userData = (await getDoc(doc(db, 'users', user!.uid))).data() as UserData;
        if (!user || !userData) throw new Error("User not found");
        if (userData.usedReferralCode) throw new Error("You have already used a referral code.");
        if (userData.referralCode === code) throw new Error("You cannot use your own referral code.");
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        const q = query(collection(db, "users"), where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid referral code.");
        }
        
        const referrerDoc = querySnapshot.docs[0];
        
        batch.update(userDocRef, { 
            usedReferralCode: code,
            referredBy: referrerDoc.id
        });

        const referralSubcollectionRef = doc(collection(db, `users/${referrerDoc.id}/referrals`));
        batch.set(referralSubcollectionRef, {
            userId: user.uid,
            name: userData.name,
            email: userData.email,
            hasInvested: false,
            date: serverTimestamp()
        });

        await batch.commit();
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
        const userData = (await getDoc(doc(db, 'users', user!.uid))).data() as UserData;
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
            totalBalance: (userData.totalBalance || 0) + amount,
            bonusEarnings: (userData.bonusEarnings || 0) + amount,
            earnings: (userData.earnings || 0) + amount,
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
         const userData = (await getDoc(doc(db, 'users', user!.uid))).data() as UserData;
        if (!user || !userData) throw new Error("User not found");
        if (userData.hasCollectedSignupBonus) throw new Error("Sign-up bonus already collected.");

        const signupBonusAmount = 200;
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: (userData.totalBalance || 0) + signupBonusAmount,
            bonusEarnings: (userData.bonusEarnings || 0) + signupBonusAmount,
            earnings: (userData.earnings || 0) + signupBonusAmount,
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
        userData: (useContext(AuthContext) as any)?.userData, // This will be provided by onSnapshot
        loading,
        isAdmin,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
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

    // Need to manage a local state for userData to feed the provider
    const [localUserData, setLocalUserData] = useState<UserData | null>(null);

    // Update local state based on what onSnapshot provides
    useEffect(() => {
        if (!user || isAdmin) {
            setLocalUserData(null);
            return;
        }
        const userDocRef = doc(db, 'users', user.uid);
        const unsub = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setLocalUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
            }
        });
        return () => unsub();
    }, [user, isAdmin]);

    const providerValue = { ...value, userData: localUserData };


    return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
