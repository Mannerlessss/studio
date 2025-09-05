
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Gem } from 'lucide-react';

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
  user: object | null; // A generic object for the mock user
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Let's keep this to manage initial state
  const router = useRouter();
  const pathname = usePathname();

  // This effect runs once on initial load.
  useEffect(() => {
    // Since there's no backend, we just stop the loading state.
    // We can decide if we want to start "logged out" by default.
    const sessionUser = sessionStorage.getItem('vaultboost-user');
    if(sessionUser) {
        setUser(JSON.parse(sessionUser));
        setUserData(mockUserData);
    }
    setLoading(false);
  }, []);

  // This effect handles redirection based on auth state.
  useEffect(() => {
    // Don't redirect while loading
    if (loading) {
      return;
    }

    const isAuthPage = pathname === '/login';
    const isAdminPage = pathname.startsWith('/admin');

    // If there's no user, and we are not on the login page or an admin page, redirect to login.
    if (!user && !isAuthPage && !isAdminPage) {
      router.push('/login');
    } 
    // If a user is logged in and tries to go to the login page, redirect to the dashboard.
    else if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  // Mock login function
  const logIn = async (email: string, pass: string) => {
    console.log('Simulating login for:', email);
    const mockUser = { email };
    setUser(mockUser);
    setUserData(mockUserData);
    sessionStorage.setItem('vaultboost-user', JSON.stringify(mockUser));
    router.push('/');
  };

  // Mock signup function
  const signUp = async (email: string, pass: string, name: string, phone: string) => {
    console.log('Simulating signup for:', name, email, phone);
    const mockUser = { email, name };
    setUser(mockUser);
    setUserData({ ...mockUserData, name, email, phone });
    sessionStorage.setItem('vaultboost-user', JSON.stringify(mockUser));
    router.push('/');
  };

  // Mock logout function
  const logOut = async () => {
    console.log('Simulating logout');
    setUser(null);
    setUserData(null);
    sessionStorage.removeItem('vaultboost-user');
    router.push('/login');
  };
  
  // Render nothing while checking initial state to prevent flash of wrong content
  if (loading) {
      return null;
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading: false, logIn, signUp, logOut }}>
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
