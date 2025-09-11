
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
    bonusEarnings: number;
    investmentEarnings: number;
    hasInvested: boolean;
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
const mockUser: User | null = null;
const mockUserData: UserData | null = null;
// --- END MOCK DATA ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Immediately set mock user and data to null to force a logged-out state
        setUser(mockUser);
        setUserData(mockUserData);
        setIsAdmin(false);
        setLoading(false);

        // Redirect to login page
        if (pathname !== '/login') {
            router.push('/login');
        }
    }, [pathname, router]);


    // --- Mock Functions ---
    const signInWithGoogle = async () => { console.log("Sign in with Google"); };
    const signUpWithEmail = async (details: any) => { console.log("Sign up with email", details); };
    const signInWithEmail = async (details: any) => { console.log("Sign in with email", details); };
    const logOut = async () => { console.log("Log out"); router.push('/login'); };
    const redeemReferralCode = async (code: string) => { console.log(`Redeeming code: ${code}`); };
    const updateUserPhone = async (phone: string) => { console.log(`Updating phone: ${phone}`); };
    const updateUserName = async (name: string) => { console.log(`Updating name: ${name}`); };
    const claimDailyBonus = async (amount: number) => { console.log(`Claiming bonus: ${amount}`); };
    const sendPasswordReset = async (email: string) => { console.log(`Sending reset to: ${email}`); };


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
    
    // Show loading screen while initializing
    if (loading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Logging out...</p>
                </div>
            </div>
        );
    }

    // If not on login page, show a redirecting message
    if (pathname !== '/login') {
         return (
             <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Redirecting to login...</p>
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
