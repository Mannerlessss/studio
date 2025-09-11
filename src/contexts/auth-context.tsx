
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth'; // Keep User type for compatibility
import { useRouter, usePathname } from 'next/navigation';
import { Gem } from 'lucide-react';
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
    hasInvested: boolean;
    lastBonusClaim?: any;
    createdAt: any;
    lastLogin: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  redeemReferralCode: (code: string) => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
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
    hasInvested: true,
    referralCode: 'GAGANPRO',
    usedReferralCode: 'FRIENDLY',
    createdAt: new Date(),
    lastLogin: new Date(),
    lastBonusClaim: null,
};
// --- END MOCK DATA ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        // This effect will run once on mount and set the initial state.
        // We start with a logged-out state.
        setLoading(false);
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
        setUserData({ ...mockUserData, name: details.name, email: details.email });
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
        if (!userData) return Promise.reject(new Error("User not found"));
        console.log(`Mock redeeming code: ${code}`);
        setUserData({ ...userData, usedReferralCode: code });
        return Promise.resolve();
    };
    
    const updateUserPhone = async (phone: string) => {
        if (!userData) return Promise.reject(new Error("User not found"));
        console.log(`Mock updating phone: ${phone}`);
        setUserData({ ...userData, phone: phone });
        return Promise.resolve();
    };

    const updateUserName = async (name: string) => {
        if (!userData) return Promise.reject(new Error("User not found"));
        console.log(`Mock updating name: ${name}`);
        setUserData({ ...userData, name: name });
        return Promise.resolve();
    };
    
    const claimDailyBonus = async (amount: number) => {
        if (!userData) return Promise.reject(new Error("User not found"));
        console.log(`Mock claiming bonus: ${amount}`);
        setUserData({ 
            ...userData, 
            totalBalance: userData.totalBalance + amount,
            bonusEarnings: userData.bonusEarnings + amount,
            lastBonusClaim: new Date(),
        });
        toast({ title: 'Bonus Claimed!', description: `You received ${amount} Rs.` });
        return Promise.resolve();
    };

    const sendPasswordReset = async (email: string) => {
        console.log(`Mock sending reset to: ${email}`);
        toast({
            title: 'Password Reset Link Sent',
            description: `If an account with ${email} exists, a reset link has been sent.`,
        });
        return Promise.resolve();
    };

    const value: AuthContextType = {
        user,
        userData,
        loading,
        isAdmin,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        redeemReferralCode,
        updateUserPhone,
        updateUserName,
        claimDailyBonus,
        sendPasswordReset,
    };
    
    // While loading, show a loading screen
    if (loading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // If there is a user, but they are not an admin and are trying to access admin pages
    if (user && !isAdmin && pathname.startsWith('/admin')) {
        router.push('/');
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        );
    }
    
    // If there is no user and they are not on the login page
    if (!user && pathname !== '/login') {
        router.push('/login');
         return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // If there IS a user and they are on the login page
    if (user && pathname === '/login') {
        router.push('/');
        return (
             <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting...</p>
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
