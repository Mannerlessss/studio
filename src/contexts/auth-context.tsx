
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define a mock user data structure.
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

// Define the shape of the authentication context.
interface AuthContextType {
  user: object | null;
  userData: UserData | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, phone: string, referCode?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A predefined mock user to simulate a successful login.
const mockUserData: UserData = {
    name: 'Gagan Sharma',
    email: 'gagansharma.gs107@gmail.com',
    phone: '7888540806',
    referralCode: 'VB788854',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 5000,
    invested: 18300,
    earnings: 4500,
    projected: 9000,
    referralEarnings: 1200,
    bonusEarnings: 300,
    investmentEarnings: 3000,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for a user in session storage to persist login across reloads
    const sessionUser = sessionStorage.getItem('vaultboost-user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
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

  const logIn = async (email: string, pass: string) => {
    console.log('Simulating login for:', email);
    const mockUser = { email };
    setUser(mockUser);
    sessionStorage.setItem('vaultboost-user', JSON.stringify(mockUser));
  };

  const signUp = async (email: string, pass: string, name: string, phone: string) => {
    console.log('Simulating signup for:', name, email, phone);
    const mockUser = { email, name };
    setUser(mockUser);
    sessionStorage.setItem('vaultboost-user', JSON.stringify(mockUser));
  };

  const logOut = async () => {
    console.log('Simulating logout');
    setUser(null);
    sessionStorage.removeItem('vaultboost-user');
    router.push('/login');
  };

  if (loading) {
    return null; // Return null or a minimal loader, but prevent app rendering
  }

  return (
    <AuthContext.Provider value={{ user, userData: user ? mockUserData : null, loading, logIn, signUp, logOut }}>
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
