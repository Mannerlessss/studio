
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, increment } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { Gem } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean; // Keep loading state for UI, but don't block rendering
  logIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string, name: string, phone: string, referCode?: string) => Promise<any>;
  logOut: () => Promise<any>;
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
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser(user);
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
    if (loading) {
      return; 
    }

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
    // No need to push here, the effect will handle it.
  }
  
  // Conditionally render a loading screen ONLY if loading is true AND it's not the login page.
  // This prevents the flash of content on protected pages.
  if (loading && pathname !== '/login') {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Gem className="w-12 h-12 text-primary animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading Vault...</p>
        </div>
    );
  }

  // If it's the login page, render it immediately without waiting for the auth check.
  if (pathname === '/login' && !user) {
    return (
        <AuthContext.Provider value={{ user, userData, loading, signUp, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
  }

  // If user is loaded, or if loading is finished on a public page, show content.
  if (!loading && user && pathname !== '/login') {
     return (
        <AuthContext.Provider value={{ user, userData, loading, signUp, logIn, logOut }}>
        {children}
        </AuthContext.Provider>
    );
  }

  // Fallback for redirect logic to catch up
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
