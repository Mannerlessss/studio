
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    User, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
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
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
                await fetchUserData(currentUser);
                setUser(currentUser);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        const protectedRoutes = ['/', '/investment', '/refer', '/settings', '/support', '/pro'];
        const isAdminRoute = pathname.startsWith('/admin');
        const isAuthRoute = pathname === '/login';

        if (!user && (protectedRoutes.includes(pathname) || isAdminRoute)) {
            router.push('/login');
        } else if (user && isAuthRoute) {
             router.push('/');
        }
    }, [user, loading, pathname, router]);

    const fetchUserData = async (firebaseUser: User): Promise<UserData | null> => {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const fetchedData = docSnap.data() as UserData;
                setUserData(fetchedData);
                return fetchedData;
            } else {
                // This case handles a user who is authenticated but doesn't have a DB record yet
                // It can happen during the first moments of sign-up
                return null;
            }
        } catch (error) {
            console.error("Fetch User Data Error: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch user profile.' });
            return null;
        }
    };
    
    const handleSuccessfulLogin = async (user: User, additionalData: any = {}) => {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // Existing user
            await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
        } else {
            // New user
            let referredBy = null;
            if (additionalData.referralCode) {
                const q = query(collection(db, "users"), where("referralCode", "==", additionalData.referralCode));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    referredBy = querySnapshot.docs[0].id;
                } else {
                     toast({ variant: 'destructive', title: 'Invalid Referral Code', description: 'The provided referral code does not exist.' });
                }
            }

            const newUser: UserData = {
                uid: user.uid,
                email: user.email || '',
                name: additionalData.name || user.displayName || 'Vault User',
                phone: additionalData.phone || user.phoneNumber || '',
                referralCode: generateReferralCode(),
                usedReferralCode: referredBy ? additionalData.referralCode : undefined,
                referredBy: referredBy || undefined,
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
            await setDoc(userDocRef, newUser);
        }
        // After DB operations, fetch the latest data and update state
        await fetchUserData(user);
        setUser(user);
        setLoading(false);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleSuccessfulLogin(result.user);
        } catch (error: any) {
            // Gracefully handle popup closed by user
            if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                toast({
                    variant: 'destructive',
                    title: 'Google Sign-In Failed',
                    description: error.message || "Could not complete Google sign-in.",
                });
            }
        }
    };

    const signUpWithEmail = async (details: any) => {
        const { email, password, name, phone, referralCode } = details;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(userCredential.user, { name, phone, referralCode });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Sign-Up Failed',
                description: error.message,
            });
        }
    };

    const signInWithEmail = async (details: any) => {
        const { email, password } = details;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(userCredential.user);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-In Failed',
                description: "Invalid email or password.",
            });
        }
    };

    const logOut = async () => {
        setLoading(true);
        await signOut(auth);
        setUser(null);
        setUserData(null);
        // The useEffect hook will handle the redirection to /login
        setLoading(false);
    };

    const redeemReferralCode = async (code: string) => {
        if (!user || !userData) throw new Error("You must be logged in.");
        if (userData.usedReferralCode) throw new Error("You have already redeemed a code.");
        if (code === userData.referralCode) throw new Error("You cannot use your own referral code.");

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid referral code.");
        }

        const referrerDoc = querySnapshot.docs[0];
        const referrerId = referrerDoc.id;
        
        if (referrerId === user.uid) {
            throw new Error("You cannot use your own referral code.");
        }

        const batch = writeBatch(db);

        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
            usedReferralCode: code,
            referredBy: referrerId,
        });

        await batch.commit();
        await fetchUserData(user);
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
