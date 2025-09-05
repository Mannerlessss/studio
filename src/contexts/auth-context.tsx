
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    User, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, writeBatch, increment } from 'firebase/firestore';
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

const generateReferralCode = () => {
    return 'VB' + Math.random().toString(36).substring(2, 8).toUpperCase();
}


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
                setUser(user);
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data() as UserData);
                    // Update last login
                    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
                } else {
                    // This case might happen if user is created in Auth but not in Firestore
                    // Or for a new Google Sign-in
                    const { displayName, email } = user;
                    const newUser: UserData = {
                        uid: user.uid,
                        name: displayName || 'Vault User',
                        email: email || '',
                        phone: '',
                        referralCode: generateReferralCode(),
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
                    await setDoc(userRef, newUser);
                    setUserData(newUser);
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
        if (loading) return;

        const isAuthPage = pathname === '/login';
        const isAdminPage = pathname.startsWith('/admin');

        if (!user && !isAuthPage && !isAdminPage) {
            router.push('/login');
        } else if (user && isAuthPage) {
            router.push('/');
        }
    }, [user, loading, pathname, router]);

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
             toast({ title: 'Login Successful!', description: 'Welcome to VaultBoost.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
            setLoading(false);
        }
    };

    const signUpWithEmail = async (details: any) => {
        setLoading(true);
        const { email, password, name, phone, referralCode } = details;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser: UserData = {
                uid: userCredential.user.uid,
                name,
                email,
                phone,
                referralCode: generateReferralCode(),
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

            if (referralCode) {
                 await redeemReferralCode(referralCode, userCredential.user.uid);
            }

            await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
            toast({ title: 'Account Created!', description: 'Welcome to VaultBoost.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
            setLoading(false);
        }
    };

    const signInWithEmail = async (details: any) => {
        setLoading(true);
        const { email, password } = details;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: 'Login Successful!', description: 'Welcome back!' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
            setLoading(false);
        }
    }

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Logout Failed', description: error.message });
        } finally {
            // State will be updated by onAuthStateChanged listener
        }
    };

    const redeemReferralCode = async (code: string, forUserId?: string) => {
        const currentUserId = forUserId || user?.uid;
        if (!currentUserId) throw new Error("User not found");
        if (userData?.usedReferralCode) throw new Error("You have already used a referral code.");

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', code));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('Invalid referral code.');
        }

        const referrerDoc = querySnapshot.docs[0];
        const referrerId = referrerDoc.id;

        if (referrerId === currentUserId) {
            throw new Error("You cannot use your own referral code.");
        }

        const batch = writeBatch(db);

        // Update current user
        const currentUserRef = doc(db, 'users', currentUserId);
        batch.update(currentUserRef, {
            usedReferralCode: code,
            referredBy: referrerId
        });

        // Update referrer user
        const referrerRef = doc(db, 'users', referrerId);
        batch.update(referrerRef, {
            referralEarnings: increment(75), // Example reward
            totalBalance: increment(75),
        });

        await batch.commit();

        // Give the new user their bonus
        await setDoc(currentUserRef, {
            bonusEarnings: increment(75),
            totalBalance: increment(75)
        }, { merge: true });


        // Manually update local state to reflect change immediately
        if (userData) {
            setUserData({ ...userData, usedReferralCode: code });
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
                </div>
            </div>
        )
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
