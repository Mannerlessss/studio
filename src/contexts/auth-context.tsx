
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
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, collectionGroup } from 'firebase/firestore';

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
        await signOut(auth);
        // State will be cleared by onAuthStateChanged listener
    };

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth loading timed out after 30 seconds. Logging out.");
                toast({
                    variant: 'destructive',
                    title: 'Loading Timeout',
                    description: 'Could not connect to the server. Please try again.',
                });
                logOut();
            }
        }, 30000); // 30 seconds

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                const userDocRef = doc(db, 'users', currentUser.uid);
                const unsubFromDoc = onSnapshot(userDocRef, 
                    (docSnap) => {
                         if (userIsAdmin) {
                            setUserData(null);
                            setLoading(false);
                            clearTimeout(loadingTimeout);
                            return;
                        }

                        if (docSnap.exists()) {
                            setUserData({ uid: docSnap.id, ...docSnap.data() } as UserData);
                        } else {
                            // User is authenticated but has no doc, might be a new signup
                            setUserData(null);
                        }
                        setLoading(false); 
                        clearTimeout(loadingTimeout);
                    },
                    (error) => {
                        console.error("Error fetching user data:", error);
                        toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile." });
                        setUserData(null);
                        setLoading(false);
                        clearTimeout(loadingTimeout);
                    }
                );
                return () => unsubFromDoc(); 
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
                clearTimeout(loadingTimeout);
            }
        });

        return () => {
            clearTimeout(loadingTimeout);
            unsubscribe();
        };
    }, []); // Removed toast and logOut from dependencies to prevent re-running

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
            
            const newUserDoc: Omit<UserData, 'uid' | 'createdAt' | 'lastLogin' | 'projected' | 'rank' | 'lastBonusClaim' | 'claimedMilestones'> = {
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
                referralCode: `${name.split(' ')[0].toUpperCase()}${(Math.random() * 9000 + 1000).toFixed(0)}`,
            };

            batch.set(userDocRef, {
                ...newUserDoc,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
            });
            
            if (referralCode) {
                 batch.update(userDocRef, { usedReferralCode: referralCode });
                 const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
                 const querySnapshot = await getDocs(q);
                 if (!querySnapshot.empty) {
                     const referrerDoc = querySnapshot.docs[0];
                     batch.update(userDocRef, { referredBy: referrerDoc.id });
                     
                     const referralSubcollectionRef = doc(collection(db, `users/${referrerDoc.id}/referrals`));
                      batch.set(referralSubcollectionRef, {
                         userId: newUser.uid,
                         name: name,
                         email: email,
                         hasInvested: false,
                         date: serverTimestamp()
                     });
                 }
            }
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

    
