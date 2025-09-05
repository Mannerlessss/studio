
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

// Mock user data for offline development
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
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        // This effect now handles redirection for the mock auth flow
        const isLoginPage = pathname === '/login';

        if (!user && !isLoginPage) {
            router.push('/login');
        } else if (user && isLoginPage) {
            router.push('/');
        }
        setLoading(false);
    }, [user, pathname, router]);

    // Simulate login by setting mock data
    const simulateLogin = () => {
        setLoading(true);
        toast({ title: 'Login Successful!', description: 'Welcome to VaultBoost (Offline Mode).' });
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
    };

    const signInWithGoogle = async () => {
        simulateLogin();
    };

    const signUpWithEmail = async (details: any) => {
        console.log('Signing up with:', details);
        simulateLogin();
    };

    const signInWithEmail = async (details: any) => {
        console.log('Signing in with:', details);
        simulateLogin();
    }

    const logOut = async () => {
        setLoading(true);
        setUser(null);
        setUserData(null);
        router.push('/login');
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    };

    const redeemReferralCode = async (code: string) => {
        toast({ title: 'Code Redeemed!', description: `Code ${code} accepted in offline mode.` });
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
