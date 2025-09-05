'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          // New user, create a document for them
          const newUserReferralCode = generateReferralCode(user.displayName || 'USER');
          const newUserData: UserData = {
            uid: user.uid,
            name: user.displayName || 'Vault User',
            email: user.email || '',
            phone: user.phoneNumber || '',
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

    const isAuthPage = pathname === '/';
    const isAdminPage = pathname.startsWith('/admin');

    if (!user && !isAuthPage && !isAdminPage) {
      router.push('/');
    } else if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Optionally show a toast message to the user
    }
  };

  const logOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const redeemReferralCode = async (code: string) => {
    if (!user || !userData || userData.usedReferralCode) {
        throw new Error("Cannot redeem code.");
    }
    // Here you would typically validate the code against your backend
    // For now, we assume any code is valid for demonstration.
    console.log(`User ${user.uid} redeeming code ${code}`);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
        usedReferralCode: true,
        // You might add a temporary bonus or flag that converts to 75 Rs on first investment
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
