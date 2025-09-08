
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth'; // Keep User type for compatibility
import { useRouter, usePathname } from 'next/navigation';
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
qc    bonusEarnings: number;
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

// --- MOCK DATA ---
const mockUser: User = {
    uid: 'mock-user-123',
    email: 'mock.user@example.com',
    displayName: 'Mock User',
    phoneNumber: '123-456-7890',
    photoURL: null,
    providerId: 'password',
    emailVerified: true,
    // Add other properties with mock values as needed
} as User;

const mockUserData: UserData = {
    uid: 'mock-user-123',
    name: 'Gagan Sharma',
    email: 'gagansharma.gs107@gmail.com',
    phone: '+91 7888540806',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 7500,
    invested: 5000,
    earnings: 2500,
    projected: 9000,
    referralEarnings: 1500,
    bonusEarnings: 200,
    investmentEarnings: 800,
    referralCode: 'GAGANPRO',
    usedReferralCode: 'FRIENDLY',
    createdAt: new Date(),
    lastLogin: new Date(),
};
// --- END MOCK DATA ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Immediately set mock user and data
        setUser(mockUser);
        setUserData(mockUserData);
        setLoading(false);

        // No need for Firebase listener anymore
    }, []);


    // --- Mock Functions ---
    const signInWithGoogle = async () => {
        console.log("Mock sign in with Google");
        setLoading(true);
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
        setLoading(false);
    };

    const signUpWithEmail = async (details: any) => {
        console.log("Mock sign up with email", details);
        setLoading(true);
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
        setLoading(false);
    };

    const signInWithEmail = async (details: any) => {
        console.log("Mock sign in with email", details);
        setLoading(true);
        setUser(mockUser);
        setUserData(mockUserData);
        router.push('/');
        setLoading(false);
    };

    const logOut = async () => {
        console.log("Mock log out");
        setLoading(true);
        setUser(null);
        setUserData(null);
        router.push('/login');
        setLoading(false);
    };

    const redeemReferralCode = async (code: string) => {
        console.log(`Mock redeeming code: ${code}`);
        if (!userData) return;
        setUserData({ ...userData, usedReferralCode: code });
        alert(`Successfully redeemed code: ${code}`);
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
    
    // Bypass login page logic
    if (pathname === '/login' && !loading && user) {
        router.push('/');
        return (
             <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        );
    }
    
    // Show loading screen while initializing
    if (loading) {
         return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
                </div>
            </div>
        );
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
