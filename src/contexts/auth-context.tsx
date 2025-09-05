
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app, auth, db } from '@/lib/firebase';
import { Gem } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string, phone: string, referCode?: string) => Promise<any>;
  logOut: () => Promise<any>;
  userData: UserData | null;
}

interface UserData {
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    invested: number;
    earnings: number;
    projected: number;
    referralEarnings: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
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
  }, [pathname, router]);

  const logIn = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    const ownReferralCode = 'VB' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newUser: UserData = {
        name,
        email,
        phone,
        referralCode: ownReferralCode,
        membership: 'Basic',
        rank: 'Bronze',
        totalBalance: 0,
        invested: 0,
        earnings: 0,
        projected: 0,
        referralEarnings: 0
    };

    await setDoc(doc(db, "users", user.uid), newUser);
    setUserData(newUser);

    if (referCode) {
        // Here you would add logic to handle the referral code, 
        // e.g., credit the referrer.
        console.log(`User signed up with referral code: ${referCode}`);
    }

    return userCredential;
  };

  const logOut = async () => {
    return signOut(auth);
  };
  
  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen">
              <Gem className="w-10 h-10 text-primary animate-pulse" />
          </div>
      )
  }

  return (
    <AuthContext.Provider value={{ user, loading, logIn, signUp, logOut, userData }}>
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
