
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
    bonusEarnings: number;
    investmentEarnings: number;
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
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
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
    }
  }, [loading, user, pathname, router]);

  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const referralCode = `REF-${user.uid.substring(0, 6).toUpperCase()}`;
    const newUser: UserData = {
        name,
        email,
        phone,
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
    };
    await setDoc(doc(db, "users", user.uid), newUser);
    setUserData(newUser);
    return userCredential;
  }

  const logIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const logOut = () => {
    return signOut(auth);
  }

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Gem className="w-12 h-12 text-primary animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading Vault...</p>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signUp, logIn, logOut }}>
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
