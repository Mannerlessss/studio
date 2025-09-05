
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
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
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
                // User is authenticated with Firebase, now get our custom user data
                await fetchUserData(currentUser);
            } else {
                // No user, clear all states
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
    
    const fetchUserData = async (firebaseUser: User) => {
        setLoading(true);
        try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const fetchedData = docSnap.data() as UserData;
                setUserData(fetchedData);
                setUser(firebaseUser); // Set the firebase user state
                await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
            } else {
                // This can happen if the user record wasn't created properly
                // Or if this is the very first login after signup.
                // We'll handle creation in handleSuccessfulLogin
                console.log("User doc does not exist yet. It will be created on login.");
                setUserData(null);
                setUser(firebaseUser); // Still set the base user
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast({
                variant: 'destructive',
                title: 'Session Error',
                description: 'Could not verify your session. Please log in again.',
            });
            await signOut(auth); // Sign out on error to prevent loops
            setUser(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessfulLogin = async (user: User, additionalData: any = {}) => {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        let finalUserData: UserData | null = null;
        
        try {
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                let referredBy = null;
                if (additionalData.referralCode) {
                    try {
                        const q = query(collection(db, "users"), where("referralCode", "==", additionalData.referralCode));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            referredBy = querySnapshot.docs[0].id;
                        } else {
                            toast({ variant: 'destructive', title: 'Invalid Referral Code' });
                        }
                    } catch (e) {
                        console.error("Error validating referral code:", e);
                    }
                }
                
                const newUser: UserData = {
                    uid: user.uid,
                    email: user.email || '',
                    name: additionalData.name || user.displayName || 'Vault User',
                    phone: additionalData.phone || '',
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
                finalUserData = newUser;
            } else {
                await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
                finalUserData = docSnap.data() as UserData;
            }
            
            setUser(user);
            setUserData(finalUserData);

        } catch (error) {
             console.error("Error during handleSuccessfulLogin:", error);
             toast({ variant: 'destructive', title: 'Login Error', description: 'Could not initialize your account.' });
        } finally {
            setLoading(false);
            if (finalUserData) {
                router.push('/');
            }
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleSuccessfulLogin(result.user);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Google Sign-In Failed',
                description: error.message,
            });
             setLoading(false);
        }
    };

    const signUpWithEmail = async (details: any) => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const signInWithEmail = async (details: any) => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
            // The useEffect hook will handle the redirect to /login
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
        if (!user || !userData) {
            throw new Error("You must be logged in.");
        }
        if (userData.usedReferralCode) {
            throw new Error("You have already redeemed a code.");
        }
        if (code === userData.referralCode) {
             throw new Error("You cannot use your own referral code.");
        }

        const q = query(collection(db, "users"), where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid referral code.");
        }
        
        const referredBy = querySnapshot.docs[0].id;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            usedReferralCode: code,
            referredBy: referredBy,
        });

        // Add 75 to the bonus of the user who referred
        const referredByUserDocRef = doc(db, 'users', referredBy);
        const referredByUserDoc = await getDoc(referredByUserDocRef);
        if (referredByUserDoc.exists()) {
            const data = referredByUserDoc.data();
            const newReferralEarnings = (data.referralEarnings || 0) + 75;
            const newTotalBalance = (data.totalBalance || 0) + 75;
            await updateDoc(referredByUserDocRef, {
                referralEarnings: newReferralEarnings,
                totalBalance: newTotalBalance,
            });
        }

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
