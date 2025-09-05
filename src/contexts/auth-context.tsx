'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: boolean; // To track if user has used a code
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    invested: number;
    earnings: number;
    projected: number;
    referralEarnings: number;
    bonusEarnings: number;
    investmentEarnings: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateReferralCode = (name: string) => {
    const namePart = name.split(' ')[0].substring(0, 4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VB${namePart}${randomPart}`;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          // New user, create a document for them
          const newUserReferralCode = generateReferralCode(currentUser.displayName || 'USER');
          const newUserData: UserData = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Vault User',
            email: currentUser.email || '',
            phone: currentUser.phoneNumber || '',
            referralCode: newUserReferralCode,
            membership: 'Basic',
            rank: 'Bronze',
            totalBalance: 0,
            invested: 0,
            earnings: 0,
            projected: 0,
            referralEarnings: 0,
            bonusEarnings: 0,
            investmentEarnings: 0,
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
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
    const isPublicPage = ['/terms', '/privacy'].includes(pathname);

    // If user is logged in, and on the login page, redirect to home
    if (user && isAuthPage) {
      router.push('/');
    }
    
    // If user is not logged in, and not on a public/auth/admin page, redirect to login
    if (!user && !isAuthPage && !isAdminPage && !isPublicPage) {
      router.push('/login');
    }

  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setLoading(false);
      throw error;
    }
  };

  const logOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const redeemReferralCode = async (code: string) => {
    if (!user || !userData || userData.usedReferralCode) {
        throw new Error("Cannot redeem code.");
    }
    console.log(`User ${user.uid} redeeming code ${code}`);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
        usedReferralCode: true,
    });
    setUserData({ ...userData, usedReferralCode: true });
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, logOut, redeemReferralCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
