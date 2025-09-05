
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Gem } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

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
      setLoading(true);
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
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
    } else if (user && isAuthPage) {
      router.push('/');
    }

  }, [user, loading, pathname, router]);

  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;

    const newUserData: UserData = {
        name: name,
        email: email,
        phone: phone,
        referralCode: `VB${newUser.uid.substring(0, 6).toUpperCase()}`,
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
    
    await setDoc(doc(db, 'users', newUser.uid), newUserData);
    
    setUser(newUser);
    setUserData(newUserData);
    return userCredential;
  }

  const logIn = async (email: string, pass: string) => {
     const userCredential = await signInWithEmailAndPassword(auth, email, pass);
     const loggedInUser = userCredential.user;
     const userDoc = await getDoc(doc(db, 'users', loggedInUser.uid));
     
     setUser(loggedInUser);
     if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
     }
     return userCredential;
  }

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    router.push('/login');
  }

  // Do not render a loading screen. Let the effect handle redirection.
  // This prevents the app from getting stuck.
  if (loading && pathname !== '/login') {
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
