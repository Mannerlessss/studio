
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
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction, arrayUnion } from 'firebase/firestore';

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    referredBy?: string;
    referrals?: any[]; // Array of referred user objects
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
                const investmentStartDate = data.lastInvestmentUpdate;
                const dailyReturnRate = data.membership === 'Pro' ? 0.13 : 0.10;
                const dailyEarning = data.invested * dailyReturnRate;

                // Calculate how many days of earnings have already been processed
                const daysAlreadyProcessed = dailyEarning > 0 ? Math.floor((data.investmentEarnings || 0) / dailyEarning) : 0;
                
                if (daysAlreadyProcessed >= 30) {
                    return; // Investment cycle is complete
                }

                // Calculate how many full 24-hour periods have passed since the investment started
                // This logic is corrected to handle the start of a new day properly.
                const nowMs = now.toMillis();
                const startMs = investmentStartDate.toMillis();
                const totalDaysSinceStart = Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24));
                
                // Determine how many new, unprocessed days there are
                const daysToProcess = totalDaysSinceStart - daysAlreadyProcessed;

                if (daysToProcess <= 0) {
                    return; // No new full day has passed since the last processing
                }
                
                // Ensure we don't process more than 30 days in total for the cycle
                const daysToActuallyProcess = Math.min(daysToProcess, 30 - daysAlreadyProcessed);
                
                if (daysToActuallyProcess <= 0) {
                    return; // No days left to process in this cycle
                }

                const totalEarningsToAdd = dailyEarning * daysToActuallyProcess;

                const newInvestmentEarnings = (data.investmentEarnings || 0) + totalEarningsToAdd;
                const newTotalBalance = (data.totalBalance || 0) + totalEarningsToAdd;
                const newTotalEarnings = (data.earnings || 0) + totalEarningsToAdd;
                
                transaction.update(userDocRef, {
                    investmentEarnings: newInvestmentEarnings,
                    totalBalance: newTotalBalance,
                    earnings: newTotalEarnings,
                });

                // Create a transaction record for each day of earnings
                for (let i = 0; i < daysToActuallyProcess; i++) {
                    const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                    // Calculate the date for the transaction to keep them sequential
                    const transactionDate = Timestamp.fromMillis(startMs + (daysAlreadyProcessed + i + 1) * 24 * 60 * 60 * 1000);
                    transaction.set(transactionRef, {
                        type: 'earning',
                        amount: dailyEarning,
                        description: `Investment Earning`,
                        status: 'Completed',
                        date: transactionDate,
                    });
                }
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
            clearTimeout(authTimeout); 
            if (unsubFromDoc) unsubFromDoc();
            
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                     setUserData(null);
                } else {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    // Process earnings ONCE before setting up the listener to avoid infinite loops
                    await processDailyEarnings(currentUser.uid); 
                    
                    unsubFromDoc = onSnapshot(userDocRef, 
                        (docSnap) => {
                             if (docSnap.exists()) {
                                setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
                            } else {
                                console.warn(`No Firestore document found for user ${currentUser.uid}. Waiting for it to be created...`);
                            }
                        },
                        (error) => {
                            console.error("Error fetching user data:", error);
                            toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile. Logging out." });
                            logOut();
                        }
                    );
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        authTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth state change timed out after 10 seconds. Forcing loading to false.");
                setLoading(false);
            }
        }, 10000); 

        return () => {
            if (unsubFromDoc) unsubFromDoc();
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

    const signUpWithEmail = async ({ name, email, phone, password }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            const referralCode = `${name.split(' ')[0].toUpperCase()}${(Math.random() * 9000 + 1000).toFixed(0)}`;
            const batch = writeBatch(db);

            // 1. Create user document
            const userDocRef = doc(db, 'users', newUser.uid);
            const newUserDoc: any = {
                uid: newUser.uid,
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
                referralCode: referralCode,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
            };

            // 2. Check for a referral code from the link
            const usedCode = localStorage.getItem('referralCode');
            if (usedCode) {
                 const q = query(collection(db, 'users'), where('referralCode', '==', usedCode));
                 const querySnapshot = await getDocs(q);

                 if (!querySnapshot.empty) {
                     const referrerDoc = querySnapshot.docs[0];
                     const referrerId = referrerDoc.id;

                     if (referrerId !== newUser.uid) {
                        newUserDoc.usedReferralCode = usedCode;
                        newUserDoc.referredBy = referrerId;
                        
                        // Add this new user to the referrer's `referrals` subcollection
                        const referrerSubCollectionRef = doc(collection(db, `users/${referrerId}/referrals`));
                        batch.set(referrerSubCollectionRef, {
                            userId: newUser.uid,
                            name: name,
                            email: email,
                            hasInvested: false,
                            joinedAt: serverTimestamp(),
                        });
                        
                        localStorage.removeItem('referralCode'); // Clean up
                     }
                 }
            }
            
            batch.set(userDocRef, newUserDoc);
            await batch.commit();

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
            bonusEarnings: userData.bonusEarnings + amount,
            earnings: userData.earnings + amount,
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
            bonusEarnings: userData.bonusEarnings + signupBonusAmount,
            earnings: userData.earnings + signupBonusAmount,
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

    