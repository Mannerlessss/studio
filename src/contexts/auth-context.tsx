
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const dummyUser: User = {
    uid: '12345',
    email: 'user@example.com',
    displayName: 'Dummy User'
};

const dummyUserData: UserData = {
    name: 'Vault User',
    email: 'user@example.com',
    phone: '123-456-7890',
    referralCode: 'DUMMYCODE',
    membership: 'Pro'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(dummyUser);
  const [userData, setUserData] = useState<UserData | null>(dummyUserData);
  const [loading, setLoading] = useState(false); // Not really loading anymore

  const logIn = async (email: string, pass: string) => {
    console.log('Mock login for', email);
    setUser(dummyUser);
    setUserData(dummyUserData);
    return Promise.resolve();
  };

  const signUp = async (email: string, pass: string, name: string, phone: string, referCode?: string) => {
    console.log('Mock signup for', name);
    setUser(dummyUser);
    setUserData({ ...dummyUserData, name, email, phone });
    return Promise.resolve();
  };

  const logOut = async () => {
    console.log('Mock logout');
    setUser(null);
    setUserData(null);
    return Promise.resolve();
  };

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
