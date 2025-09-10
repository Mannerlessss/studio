
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data() as UserData);
                }
                setUser(user);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSuccessfulLogin = async (user: User, referredByCode?: string) => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // User exists, update last login
            await updateDoc(userDocRef, {
                lastLogin: serverTimestamp(),
            });
            setUserData(userDocSnap.data() as UserData);
        } else {
            // New user, create document
            const referralCode = `${(user.displayName || user.email?.split('@')[0] || 'USER').slice(0, 5).toUpperCase()}${Math.random().toString(36).substring(2, 6)}`;
            
            const newUser: UserData = {
                uid: user.uid,
                name: user.displayName || 'Vault User',
                email: user.email || '',
                phone: user.phoneNumber || '',
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

            if (referredByCode) {
                 const q = query(collection(db, "users"), where("referralCode", "==", referredByCode));
                 const querySnapshot = await getDocs(q);
                 if (!querySnapshot.empty) {
                     const referrerDoc = querySnapshot.docs[0];
                     newUser.referredBy = referrerDoc.id;
                     newUser.usedReferralCode = referredByCode;
                 } else {
                    toast({
                        variant: 'destructive',
                        title: 'Invalid Referral Code',
                        description: `The code "${referredByCode}" is not valid.`,
                    });
                 }
            }

            await setDoc(userDocRef, newUser);
            setUserData(newUser);
        }
        router.push('/');
    }

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleSuccessfulLogin(result.user);
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: 'destructive',
                    title: 'Google Sign-In Failed',
                    description: error.message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async ({ name, email, password, phone, referralCode }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Override user object for profile creation
            const profileDetails = {
                ...user,
                displayName: name,
                phoneNumber: phone
            }

            await handleSuccessfulLogin(profileDetails, referralCode);

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
        setLoading(true);
        try {
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
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
            router.push('/login');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const redeemReferralCode = async (code: string) => {
        if (!user || !userData || userData.usedReferralCode) {
            throw new Error("Action not allowed.");
        }

        const batch = writeBatch(db);

        // 1. Check if the referral code is valid and belongs to another user
        const q = query(collection(db, "users"), where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
            throw new Error("This code is invalid or belongs to you.");
        }

        const referrerDoc = querySnapshot.docs[0];
        
        // 2. Update the current user's document
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
            usedReferralCode: code,
            referredBy: referrerDoc.id,
        });

        // 3. (Optional) Update local state immediately
        setUserData({ ...userData, usedReferralCode: code, referredBy: referrerDoc.id });

        await batch.commit();
    };

    const value: AuthContextType = {
        user,
        userData,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
    };
    
    // Auth-aware routing
    useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/login';
        const isProtectedPage = !isAuthPage;

        if (isProtectedPage && !user) {
            router.push('/login');
        }
        if (isAuthPage && user) {
            router.push('/');
        }

    }, [user, loading, pathname, router]);

    
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
    
    // Render children only when loading is false and routing is settled
    if ((pathname === '/login' && user) || (pathname !== '/login' && !user)) {
         return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting...</p>
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

    