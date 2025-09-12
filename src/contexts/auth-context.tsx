
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

                if (!userDoc.exists()) throw "Document does not exist!";
                
                const data = userDoc.data() as UserData;
                if (!data.invested || data.invested <= 0) return;

                const now = Timestamp.now();
                const lastUpdate = data.lastInvestmentUpdate || data.createdAt;
                
                const hoursSinceLastUpdate = (now.toMillis() - lastUpdate.toMillis()) / (1000 * 60 * 60);
                if (hoursSinceLastUpdate < 24) return;
                
                const daysToProcess = Math.floor(hoursSinceLastUpdate / 24);

                const investmentStartDate = data.lastInvestmentUpdate || now; 
                const daysElapsedSinceStart = Math.ceil((now.toMillis() - investmentStartDate.toMillis()) / (1000 * 60 * 60 * 24));
                const daysRemainingInCycle = 30 - daysElapsedSinceStart;
                
                const daysToActuallyProcess = Math.min(daysToProcess, daysRemainingInCycle >= 0 ? daysRemainingInCycle : 0);

                if (daysToActuallyProcess <= 0) {
                     console.log("Investment cycle complete or no full day passed.");
                     return;
                }

                const dailyReturnRate = data.membership === 'Pro' ? 0.13 : 0.10;
                const dailyEarning = data.invested * dailyReturnRate;
                const totalEarningsToAdd = dailyEarning * daysToActuallyProcess;

                const newInvestmentEarnings = (data.investmentEarnings || 0) + totalEarningsToAdd;
                const newTotalBalance = (data.totalBalance || 0) + totalEarningsToAdd;
                const newTotalEarnings = (data.earnings || 0) + totalEarningsToAdd;
                
                const newLastInvestmentUpdate = Timestamp.fromMillis(lastUpdate.toMillis() + daysToActuallyProcess * 24 * 60 * 60 * 1000);

                transaction.update(userDocRef, {
                    investmentEarnings: newInvestmentEarnings,
                    totalBalance: newTotalBalance,
                    earnings: newTotalEarnings,
                    lastInvestmentUpdate: newLastInvestmentUpdate,
                });

                for (let i = 0; i < daysToActuallyProcess; i++) {
                    const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                    const transactionDate = Timestamp.fromMillis(lastUpdate.toMillis() + (i + 1) * 24 * 60 * 60 * 1000);
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
            console.error("Error processing daily earnings: ", error);
        }
    };


    useEffect(() => {
        let unsubFromDoc: (() => void) | undefined;
        let loadingTimeout: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (unsubFromDoc) unsubFromDoc();

            if (currentUser) {
                setLoading(true);
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                    setUserData(null);
                    setLoading(false);
                    return;
                }
                
                await processDailyEarnings(currentUser.uid);

                const userDocRef = doc(db, 'users', currentUser.uid);
                unsubFromDoc = onSnapshot(userDocRef, 
                    (docSnap) => {
                        if (docSnap.exists()) {
                            setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
                        } else {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. Logging out.`);
                            logOut();
                        }
                        setLoading(false); 
                    },
                    (error) => {
                        console.error("Error fetching user data:", error);
                        toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile. Logging out." });
                        logOut();
                        setLoading(false);
                    }
                );
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            if (unsubFromDoc) unsubFromDoc();
            unsubscribe();
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

            const batch = writeBatch(db);
            const userDocRef = doc(db, 'users', newUser.uid);
            
            const signupBonus = 200;

            const newUserDoc: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin' | 'projected' | 'rank' | 'lastBonusClaim' | 'claimedMilestones' | 'lastInvestmentUpdate'> = {
                name,
                email,
                phone,
                membership: 'Basic',
                totalBalance: signupBonus,
                invested: 0,
                earnings: signupBonus,
                referralEarnings: 0,
                bonusEarnings: signupBonus,
                investmentEarnings: 0,
                hasInvested: false,
                referralCode: `${name.split(' ')[0].toUpperCase()}${(Math.random() * 9000 + 1000).toFixed(0)}`,
            };

            batch.set(userDocRef, {
                ...newUserDoc,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
            });
            
            // Add signup bonus transaction
            const signupBonusTransactionRef = doc(collection(db, `users/${newUser.uid}/transactions`));
            batch.set(signupBonusTransactionRef, {
                type: 'bonus',
                amount: signupBonus,
                description: 'Sign-up Bonus',
                status: 'Completed',
                date: serverTimestamp(),
            });


            if (referralCode) {
                try {
                    const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        batch.update(userDocRef, { 
                            usedReferralCode: referralCode,
                            referredBy: referrerDoc.id 
                        });
                        
                        const referralSubcollectionRef = doc(collection(db, `users/${referrerDoc.id}/referrals`));
                         batch.set(referralSubcollectionRef, {
                            userId: newUser.uid,
                            name: name,
                            email: email,
                            hasInvested: false,
                            date: serverTimestamp()
                        });
                    } else {
                         console.warn(`Referral code "${referralCode}" not found.`);
                    }
                } catch (referralError) {
                    console.error("Error processing referral code, but user will still be created:", referralError);
                }
            }
            await batch.commit();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const idTokenResult = await credential.user.getIdTokenResult();
            if (!idTokenResult.claims.admin) {
                const userDocRef = doc(db, 'users', credential.user.uid);
                await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message,
            });
        } finally {
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
    
    const redeemReferralCode = async (code: string) => {
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

    const value: AuthContextType = {
        user,
        userData,
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

    