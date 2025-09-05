
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: boolean;
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
  user: any | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUserData: UserData = {
    uid: 'mock-user-123',
    name: 'Gagan Sharma',
    email: 'gagan@example.com',
    phone: '+919876543210',
    referralCode: 'VB-MOCK123',
    usedReferralCode: false,
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 5000,
    invested: 10000,
    earnings: 2500,
    projected: 15000,
    referralEarnings: 500,
    bonusEarnings: 100,
    investmentEarnings: 1900,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>({ uid: 'mock-user-123' });
  const [userData, setUserData] = useState<UserData | null>(mockUserData);
  const [loading, setLoading] = useState(false);

  // Mock functions to prevent errors
  const signInWithGoogle = async () => console.log("Sign in attempted (mock)");
  const logOut = async () => console.log("Log out attempted (mock)");
  const redeemReferralCode = async (code: string) => {
    console.log(`Redeem code attempted (mock): ${code}`);
    // Simulate success for UI update
    setUserData(prev => prev ? ({ ...prev, usedReferralCode: true }) : null);
  };

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
