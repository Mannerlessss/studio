
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Gem } from 'lucide-react';

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
    uid: 'mock-user-123',
    email: 'test@example.com',
    emailVerified: true,
    displayName: 'Mock User',
    isAnonymous: false,
    photoURL: '',
    providerData: [],
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    delete: async () => {},
    toJSON: () => ({}),
    providerId: 'password'
};

const mockUserData: UserData = {
    uid: 'mock-user-123',
    name: 'VaultBoost User',
    email: 'user@vaultboost.app',
    phone: '+91 98765 43210',
    referralCode: 'BOOST123',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 7500,
    invested: 5000,
    earnings: 2500,
    projected: 9000,
    referralEarnings: 1200,
    bonusEarnings: 300,
    investmentEarnings: 1000,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(mockUser);
    const [userData, setUserData] = useState<UserData | null>(mockUserData);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const signInWithGoogle = async () => {
        toast({ title: 'Logged in with Google (Mock)' });
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
    };

    const signUpWithEmail = async (details: any) => {
        console.log('Signing up with:', details);
        toast({ title: 'Signed up (Mock)' });
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
    };

    const signInWithEmail = async (details: any) => {
        console.log('Signing in with:', details);
        toast({ title: 'Signed in (Mock)' });
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
    };

    const logOut = async () => {
        toast({ title: 'Logged Out (Mock)' });
        setUser(null);
        setUserData(null);
        router.push('/login');
    };

    const redeemReferralCode = async (code: string) => {
        if (userData?.usedReferralCode) {
            toast({ variant: 'destructive', title: 'Code already used (Mock)' });
            throw new Error("You have already used a referral code.");
        }
        console.log(`Redeeming code ${code} (Mock)`);
        toast({ title: `Code ${code} redeemed! (Mock)`});
        setUserData(prev => prev ? { ...prev, usedReferralCode: code } : null);
    };

    const value: AuthContextType = {
        user,
        userData,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
                </div>
            </div>
        )
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
