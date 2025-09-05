'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
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

const mockUser = {
  uid: 'mock-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
} as User;

const mockUserData: UserData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    referralCode: 'MOCKREF123',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 5000,
    invested: 2000,
    earnings: 500,
    projected: 550,
    referralEarnings: 200,
    bonusEarnings: 50,
    investmentEarnings: 250,
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [userData, setUserData] = useState<UserData | null>(mockUserData);
  const [loading, setLoading] = useState(false); // Set loading to false by default

  const signUp = async () => {
    console.log("Signup disabled");
    return Promise.resolve();
  }

  const logIn = async () => {
    console.log("Login disabled");
    return Promise.resolve();
  }

  const logOut = async () => {
    console.log("Logout disabled");
    setUser(null);
    setUserData(null);
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
