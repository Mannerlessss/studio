
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    referredBy?: string;
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    invested: number;
    earnings: number;
    projected: number;
    referralEarnings: number;
    bonusEarnings: number;
    investmentEarnings: number;
    createdAt: any;
    lastLogin: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
    uid: 'mock-user-id',
    email: 'test@example.com',
    displayName: 'Mock User',
    photoURL: null,
    phoneNumber: '1234567890',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'password',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token', expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null, claims: {} }),
    reload: async () => {},
    toJSON: () => ({}),
};


const mockUserData: UserData = {
  uid: 'mock-user-id',
  name: 'Gagan Sharma',
  email: 'gagansharma.gs107@gmail.com',
  phone: '+91 78885 40806',
  referralCode: 'VBKRT45F',
  usedReferralCode: 'FRIENDCODE',
  membership: 'Pro',
  rank: 'Gold',
  totalBalance: 2500,
  invested: 10000,
  earnings: 2500,
  projected: 15000,
  referralEarnings: 750,
  bonusEarnings: 50,
  investmentEarnings: 1700,
  createdAt: new Date(),
  lastLogin: new Date(),
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    toast({ title: 'Offline Mode', description: 'Google Sign-In is disabled.' });
  };

  const signUpWithEmail = async (details: any) => {
    toast({ title: 'Offline Mode', description: 'Email Sign-Up is disabled.' });
  };

  const signInWithEmail = async (details: any) => {
     toast({ title: 'Offline Mode', description: 'Email Sign-In is disabled.' });
  }

  const logOut = async () => {
    toast({ title: 'Offline Mode', description: 'Logout is disabled.' });
  };

 const redeemReferralCode = async (code: string) => {
    toast({ title: 'Code Redeemed!', description: `Code ${code} accepted in offline mode.` });
  };


  const value: AuthContextType = {
    user: mockUser,
    userData: mockUserData,
    loading: false,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logOut,
    redeemReferralCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
