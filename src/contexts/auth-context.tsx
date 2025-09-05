
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, runTransaction, arrayUnion } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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
    const prefix = "VB";
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomPart}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          // This case handles new Google Sign-In users
          const newUser: UserData = {
            uid: user.uid,
            name: user.displayName || 'Vault User',
            email: user.email || '',
            phone: user.phoneNumber || '',
            membership: 'Basic',
            rank: 'Bronze',
            referralCode: generateReferralCode(),
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
        setUser(user);
        if (pathname === '/login') {
            router.push('/');
        }
      } else {
        setUser(null);
        setUserData(null);
         if (pathname !== '/login') {
            router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Google Sign-In Error', description: error.message });
        setLoading(false);
    }
  };

  const signUpWithEmail = async (details: any) => {
    const { name, email, phone, password, referralCode } = details;
    try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: UserData = {
            uid: userCredential.user.uid,
            name,
            email,
            phone,
            membership: 'Basic',
            rank: 'Bronze',
            referralCode: generateReferralCode(),
            usedReferralCode: referralCode || undefined,
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
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        if(referralCode) {
            await redeemReferralCode(referralCode, userCredential.user.uid);
        }
        // onAuthStateChanged will handle the rest
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Sign Up Error', description: error.message });
        setLoading(false);
    }
  };

  const signInWithEmail = async (details: any) => {
    const { email, password } = details;
    try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the rest
    } catch (error: any) {
         toast({ variant: 'destructive', title: 'Sign In Error', description: 'Invalid email or password.' });
         setLoading(false);
    }
  }


  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    // onAuthStateChanged will handle redirection
  };

 const redeemReferralCode = async (code: string, redeemingUserId?: string) => {
    const finalUserId = redeemingUserId || user?.uid;
    if (!finalUserId) throw new Error('You must be logged in.');

    const currentUserRef = doc(db, 'users', finalUserId);

    try {
        await runTransaction(db, async (transaction) => {
            const currentUserSnap = await transaction.get(currentUserRef);
            if (!currentUserSnap.exists() || currentUserSnap.data().usedReferralCode) {
                throw new Error('Code already used or user not found.');
            }

            // Simple validation, can be improved with a query
            if(code.length < 6) throw new Error('Invalid referral code format.');

            // Note: This is a simplified check. A robust solution would query
            // the 'users' collection for the code. This requires an index.
            // For now, we assume the code is valid and find the owner later.
            transaction.update(currentUserRef, {
                usedReferralCode: code,
            });
        });

        toast({ title: 'Success!', description: 'Referral code accepted.' });
        // Update local state
        setUserData(prev => prev ? { ...prev, usedReferralCode: code } : null);

    } catch (error: any) {
        console.error("Redemption error:", error);
        throw new Error(error.message || 'This code is invalid or has already been used.');
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
