
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    User
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, query, where, collection, updateDoc, writeBatch } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Gem } from 'lucide-react';

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
    createdAt: any;
    lastLogin: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  claimDailyBonus: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

     useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser(currentUser);
                    setUserData(userDocSnap.data() as UserData);
                } else {
                    await signOut(auth);
                    setUser(null);
                    setUserData(null);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading) {
            const isAuthPage = pathname === '/login';
            if (user && isAuthPage) {
                router.push('/');
            } else if (!user && !isAuthPage) {
                router.push('/login');
            }
        }
    }, [user, loading, pathname, router]);

    const handleSuccessfulLogin = async (loggedInUser: User, extraData?: { name?: string, phone?: string, referralCode?: string }) => {
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        let finalUserData: UserData;

        if (userDocSnap.exists()) {
            await updateDoc(userDocRef, {
                lastLogin: serverTimestamp(),
            });
            finalUserData = userDocSnap.data() as UserData;
        } else {
             const referralCode = `${(extraData?.name || loggedInUser.displayName || loggedInUser.email?.split('@')[0] || 'USER').slice(0, 5).toUpperCase()}${Math.random().toString(36).substring(2, 6)}`;
            
            const newUser: UserData = {
                uid: loggedInUser.uid,
                name: extraData?.name || loggedInUser.displayName || 'Vault User',
                email: loggedInUser.email || '',
                phone: extraData?.phone || loggedInUser.phoneNumber || '',
                referralCode,
                membership: 'Basic',
                rank: 'Bronze',
                totalBalance: 0,
                invested: 0,
                earnings: 0,
                projected: 0,
                referralEarnings: 0,
                bonusEarnings: 0,
                investmentEarnings: 0,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            };
            
            if (extraData?.referralCode) {
                 const q = query(collection(db, "users"), where("referralCode", "==", extraData.referralCode.toUpperCase()));
                 const querySnapshot = await getDocs(q);
                 if (!querySnapshot.empty) {
                     const referrerDoc = querySnapshot.docs[0];
                     newUser.referredBy = referrerDoc.id;
                     newUser.usedReferralCode = extraData.referralCode;
                 } else {
                    toast({
                        variant: 'destructive',
                        title: 'Invalid Referral Code',
                        description: `The code "${extraData.referralCode}" is not valid.`,
                    });
                 }
            }
            await setDoc(userDocRef, newUser);
            finalUserData = newUser;
        }
        
        setUser(loggedInUser);
        setUserData(finalUserData);
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleSuccessfulLogin(result.user);
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: 'destructive',
                    title: 'Google Sign-In Failed',
                    description: error.message,
                });
            }
        }
    };

    const signUpWithEmail = async ({ name, email, password, phone, referralCode }: any) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(userCredential.user, { name, phone, referralCode });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-Up Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        try {
            setLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(result.user);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        }
    };

    const redeemReferralCode = async (code: string) => {
        if (!user || !userData || userData.usedReferralCode) {
            throw new Error("Action not allowed.");
        }

        const batch = writeBatch(db);
        const q = query(collection(db, "users"), where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
            throw new Error("This code is invalid or belongs to you.");
        }

        const referrerDoc = querySnapshot.docs[0];
        
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
            usedReferralCode: code,
            referredBy: referrerDoc.id,
        });

        setUserData({ ...userData, usedReferralCode: code, referredBy: referrerDoc.id });

        await batch.commit();
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("No user is logged in.");
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { phone });
            setUserData(prev => prev ? { ...prev, phone } : null);
            toast({
                title: 'Success!',
                description: 'Your phone number has been updated.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
            throw error;
        }
    };
    
    const claimDailyBonus = (amount: number) => {
        if (!userData) return;
        
        // This is a local update for the mock scenario.
        // For a real app, this would be an update to Firestore.
        const newUserData = {
            ...userData,
            earnings: userData.earnings + amount,
            bonusEarnings: userData.bonusEarnings + amount,
            totalBalance: userData.totalBalance + amount,
        };
        setUserData(newUserData);
        toast({
            title: 'Bonus Claimed!',
            description: `You've received ${amount} Rs.`,
        });
    }

    const value: AuthContextType = {
        user,
        userData,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
        updateUserPhone,
        claimDailyBonus,
    };
    
    if (loading) {
         return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
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
