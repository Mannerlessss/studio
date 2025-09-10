
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    User,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, query, where, collection, updateDoc, writeBatch, addDoc } from 'firebase/firestore';
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
  claimDailyBonus: (amount: number) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isInitialising, setIsInitialising] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

     useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const dbData = userDocSnap.data() as UserData;
                    setUserData(dbData);
                    await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
                } else {
                    // This can happen if user is deleted from db but not from auth
                    await signOut(auth);
                }
                setUser(currentUser);
            } else {
                setUser(null);
                setUserData(null);
            }
            setIsInitialising(false);
            setLoading(false);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isInitialising) return;

        const isAuthPage = pathname.startsWith('/login');
        const isAdminPage = pathname.startsWith('/admin');
        const isPublicPage = ['/terms', '/privacy'].includes(pathname);

        if (isPublicPage || isAdminPage) return;

        if (!user && !isAuthPage) {
            router.push('/login');
        } else if (user && isAuthPage) {
            router.push('/');
        }
    }, [user, isInitialising, pathname, router]);


    const handleSuccessfulLogin = async (loggedInUser: User, extraData?: { name?: string, phone?: string, referralCode?: string }) => {
        setLoading(true);
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
             // Data will be fetched by onAuthStateChanged, just update last login
             await updateDoc(userDocRef, {
                lastLogin: serverTimestamp(),
            });
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
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const signUpWithEmail = async ({ name, email, password, phone, referralCode }: any) => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        } finally {
            // State updates will be triggered by onAuthStateChanged
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
    
    const claimDailyBonus = async (amount: number) => {
        if (!user || !userData) return;
        
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const newBalance = userData.totalBalance + amount;
            const newBonusEarnings = userData.bonusEarnings + amount;
            const newEarnings = userData.earnings + amount;

            const batch = writeBatch(db);
            
            // Update user's balance
            batch.update(userDocRef, {
                totalBalance: newBalance,
                bonusEarnings: newBonusEarnings,
                earnings: newEarnings,
            });
            
            // Create a new transaction record
            const transactionsColRef = collection(db, `users/${user.uid}/transactions`);
            batch.set(doc(transactionsColRef), {
                type: 'bonus',
                amount: amount,
                description: 'Daily Bonus Claim',
                status: 'Completed',
                date: serverTimestamp(),
            });

            await batch.commit();

            // Update local state
            setUserData({ 
                ...userData,
                totalBalance: newBalance,
                bonusEarnings: newBonusEarnings,
                earnings: newEarnings,
            });

            toast({
                title: 'Bonus Claimed!',
                description: `You've received ${amount} Rs.`,
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Claim Failed',
                description: 'Could not update your balance. Please try again.',
            });
        }
    }
    
    const sendPasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Password Reset Email Sent',
                description: `A reset link has been sent to ${email}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Reset Failed',
                description: error.message,
            });
        }
    };

    const value: AuthContextType = {
        user,
        userData,
        loading: isInitialising || loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
        updateUserPhone,
        claimDailyBonus,
        sendPasswordReset,
    };
    
    if (isInitialising) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background">
                <div className="text-center p-4">
                    <h1 className="text-3xl font-bold tracking-widest text-primary">
                        UPI BOOST VAULT
                    </h1>
                    <p className="text-md text-muted-foreground mt-4">
                        Your partner❤️ takes time to respond you so our dashboard is 😉
                    </p>
                    <div className="relative w-16 h-16 mx-auto mt-6">
                        <Gem className="w-16 h-16 text-primary animate-sparkle" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

    