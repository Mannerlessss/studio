
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Gem } from 'lucide-react';

// Mock User and Auth
type User = {
  uid: string;
  email: string;
  displayName: string;
};

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const dummyUser: User = {
    uid: '12345',
    email: 'user@example.com',
    displayName: 'Vault User'
};

const dummyUserData: UserData = {
    name: 'Vault User',
    email: 'user@example.com',
    phone: '123-456-7890',
    referralCode: 'DUMMYCODE',
    membership: 'Pro',
    rank: 'Gold',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This is a mock auth state checker
    const checkAuth = () => {
        setLoading(true);
        const isLoggedIn = !!user; // In a real app, you'd check a token
        if (!isLoggedIn && pathname !== '/login') {
            router.push('/login');
        } else {
            // If the user is somehow logged in, give them dummy data
            if (!userData) {
                setUser(dummyUser);
                setUserData(dummyUserData);
            }
        }
        setLoading(false);
    };
    checkAuth();
  }, [user, pathname, router, userData]);

  const logIn = async (email: string, pass: string) => {
    console.log('Mock login for', email);
    const newUser = { ...dummyUser, email: email};
    setUser(newUser);
    setUserData({ ...dummyUserData, email: email });
    return Promise.resolve();
  };

  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    console.log('Mock signup for', name);
    const newUser = { ...dummyUser, email: email, displayName: name };
    setUser(newUser);
    setUserData({ ...dummyUserData, name, email, phone, referralCode: referCode });
    return Promise.resolve();
  };

  const logOut = async () => {
    console.log('Mock logout');
    setUser(null);
    setUserData(null);
    return Promise.resolve();
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
