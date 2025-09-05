'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { Gem } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

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

// Mock user object that Firebase would typically provide
const mockUser = (email: string, name: string): User => ({
  uid: 'mock-user-id',
  email: email,
  displayName: name,
  // Add other User properties as needed, with mock values
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({
    token: 'mock-id-token',
    claims: {},
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    expirationTime: '',
  }),
  reload: async () => {},
  toJSON: () => ({}),
});


const mockUserData = (name: string, email: string, phone: string, referCode?: string): UserData => ({
    name: name,
    email: email,
    phone: phone,
    referralCode: referCode || 'MOCKREF123',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 5000,
    invested: 2000,
    earnings: 500,
    projected: 550,
    referralEarnings: 200,
    bonusEarnings: 50,
    investmentEarnings: 250,
});


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

   useEffect(() => {
    // In a real app, this is where you'd check for a logged-in user.
    // We'll just finish loading.
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


  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    const newUser = mockUser(email, name);
    const newUserData = mockUserData(name, email, phone, referCode);
    setUser(newUser);
    setUserData(newUserData);
    return Promise.resolve(newUser);
  }

  const logIn = async (email: string, pass: string) => {
     // For mock purposes, any login is successful
    const loggedInUser = mockUser(email, 'Test User');
    const loggedInUserData = mockUserData('Test User', email, '123-456-7890');
    setUser(loggedInUser);
    setUserData(loggedInUserData);
    return Promise.resolve(loggedInUser);
  }

  const logOut = async () => {
    setUser(null);
    setUserData(null);
    router.push('/login');
    return Promise.resolve();
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
