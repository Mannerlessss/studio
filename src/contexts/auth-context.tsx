
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
import { doc, getDoc, setDoc, serverTimestamp, getDocs, query, where, collection, updateDoc, writeBatch, Timestamp, onSnapshot, addDoc } from 'firebase/firestore';
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
    hasInvested: boolean; // New field
    lastBonusClaim?: Timestamp;
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
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "gagansharma.gs107@gmail.com";

const generateReferralCode = (name: string) => `${name.slice(0, 5).toUpperCase()}${Math.random().toString(36).substring(2, 6)}`;

const createNewUserData = (user: User, extraData?: { name?: string, phone?: string, referralCode?: string }): UserData => ({
    uid: user.uid,
    name: extraData?.name || user.displayName || 'Vault User',
    email: user.email || '',
    phone: extraData?.phone || user.phoneNumber || '',
    referralCode: generateReferralCode(extraData?.name || user.displayName || 'USER'),
    usedReferralCode: extraData?.referralCode || '',
    membership: 'Basic',
    rank: 'Bronze',
    totalBalance: 0,
    invested: 0,
    earnings: 0,
    projected: 0,
    referralEarnings: 0,
    bonusEarnings: 0,
    investmentEarnings: 0,
    hasInvested: false,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isInitialising, setIsInitialising] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

     useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                
                const unsubDoc = onSnapshot(userDocRef, async (userDocSnap) => {
                    if (userDocSnap.exists()) {
                        const dbData = userDocSnap.data() as UserData;
                        setUserData(dbData);
                         if (dbData.lastLogin) { // Only update if not the first login
                            await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
                        }
                    } else {
                        // This case handles sign-in where a user exists in Auth but not Firestore.
                        // For example, Google Sign in for the first time.
                        const newUser = createNewUserData(currentUser);
                        await setDoc(userDocRef, newUser);
                        setUserData(newUser); 
                    }
                    setIsInitialising(false);
                }, (error) => {
                    console.error("Auth Snapshot Error:", error);
                    setIsInitialising(false);
                });
                 return () => unsubDoc();
            } else {
                setUser(null);
                setUserData(null);
                setIsInitialising(false); 
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isInitialising) return;

        const isAuthPage = pathname.startsWith('/login');
        const isAdminPage = pathname.startsWith('/admin');
        const isPublicPage = ['/terms', '/privacy'].includes(pathname);
        
        if (isPublicPage) return;

        if (user) {
            if (user.email === ADMIN_EMAIL) {
                if (!isAdminPage) router.push('/admin');
            } else {
                 if (isAdminPage) router.push('/');
                 if (isAuthPage) router.push('/');
            }
        } else {
            if (!isAuthPage) router.push('/login');
        }

    }, [user, userData, isInitialising, pathname, router]);


    const handleSuccessfulSignUp = async (loggedInUser: User, extraData: { name: string, phone: string, referralCode?: string }) => {
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const newUser = createNewUserData(loggedInUser, extraData);
        
        // The referral code is now just stored, not validated here.
        // Validation happens when the user *redeems* a code on the settings page.
        if (extraData.referralCode) {
            newUser.usedReferralCode = extraData.referralCode.toUpperCase();
        }

        await setDoc(userDocRef, newUser);
        setUser(loggedInUser);
        // The onSnapshot listener will pick up the new user data.
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle data creation/update
        } catch (error: any) {
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
            await handleSuccessfulSignUp(userCredential.user, { name, phone, referralCode });
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
            await signInWithEmailAndPassword(auth, email, password);
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
        if (!user || !userData || userData.referredBy) {
            throw new Error("Action not allowed. You may have already used a code.");
        }

        const batch = writeBatch(db);
        const q = query(collection(db, "users"), where("referralCode", "==", code.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
            throw new Error("This code is invalid or belongs to you.");
        }

        const referrerDoc = querySnapshot.docs[0];
        
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
            usedReferralCode: code.toUpperCase(),
            referredBy: referrerDoc.id,
        });
        
        const referrerReferralsRef = collection(db, 'users', referrerDoc.id, 'referrals');
        batch.set(doc(referrerReferralsRef), {
            userId: user.uid,
            name: userData.name,
            email: userData.email,
            date: serverTimestamp(),
            hasInvested: false
        });

        await batch.commit();
    };

    const updateUserName = async (name: string) => {
        if (!user) throw new Error("No user is logged in.");
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { name });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
            throw error;
        }
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("No user is logged in.");
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { phone });
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
            const batch = writeBatch(db);
            const userDocRef = doc(db, 'users', user.uid);
            
            batch.update(userDocRef, {
                totalBalance: (userData.totalBalance || 0) + amount,
                bonusEarnings: (userData.bonusEarnings || 0) + amount,
                earnings: (userData.earnings || 0) + amount,
                lastBonusClaim: serverTimestamp(),
            });
            
            const transactionsColRef = collection(db, `users/${user.uid}/transactions`);
            batch.set(doc(transactionsColRef), {
                type: 'bonus',
                amount: amount,
                description: 'Daily Bonus Claim',
                status: 'Completed',
                date: serverTimestamp(),
            });

            await batch.commit();

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
        updateUserName,
        claimDailyBonus,
        sendPasswordReset,
    };
    
    if (isInitialising) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
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

    