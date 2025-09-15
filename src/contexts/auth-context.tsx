'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { 
    User, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import type { Timestamp } from 'firebase/firestore';


// --- MOCK DATA ---
// Since the backend is removed, we use static mock data.

export interface Investment {
    id: string;
    planAmount: number;
    dailyReturn: number;
    startDate: Timestamp;
    lastUpdate: Timestamp;
    durationDays: number;
    earnings: number;
    status: 'active' | 'completed';
}

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    totalInvested: number;
    totalEarnings: number;
    totalReferralEarnings: number;
    totalBonusEarnings: number;
    totalInvestmentEarnings: number;
    hasInvested: boolean;
    hasCollectedSignupBonus: boolean;
    investedReferralCount: number;
    lastBonusClaim?: Timestamp;
    investments?: Investment[];
}

const MOCK_USER_DATA: UserData = {
    uid: 'mock-user-123',
    name: 'Demo User',
    email: 'user@example.com',
    phone: '123-456-7890',
    referralCode: 'DEMO123',
    membership: 'Pro',
    rank: 'Gold',
    totalBalance: 1250.75,
    totalInvested: 500,
    totalEarnings: 750.75,
    totalReferralEarnings: 150,
    totalBonusEarnings: 50.75,
    totalInvestmentEarnings: 550,
    hasInvested: true,
    hasCollectedSignupBonus: true,
    investedReferralCount: 2,
    investments: [
        {
            id: 'inv-1',
            planAmount: 500,
            dailyReturn: 50,
            earnings: 250,
            durationDays: 30,
            status: 'active',
            startDate: {} as Timestamp,
            lastUpdate: {} as Timestamp,
        }
    ]
};

// Mock admin user for demonstration
const MOCK_ADMIN_USER = {
    uid: 'mock-admin-123',
    email: 'admin@example.com',
};


interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  totalROI: number;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  collectSignupBonus: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    
    // Total ROI is now a mock value
    const totalROI = useMemo(() => {
        if (!userData || !userData.investments) return 0;
        const totalInvestedInActivePlans = userData.investments
            .filter(inv => inv.status === 'active')
            .reduce((acc, inv) => acc + inv.planAmount, 0);
        return totalInvestedInActivePlans * 3;
    }, [userData]);


    const logOut = async () => {
        setLoading(true);
        try {
            // In a real app, you'd call signOut(auth)
            console.log("Logging out.");
        } catch (error) {
            console.error("Error signing out: ", error);
        } finally {
            setUser(null);
            setUserData(null);
            setIsAdmin(false);
            router.push('/login');
            setLoading(false);
        }
    };

    useEffect(() => {
        // This effect now only manages routing based on a simulated auth state.
        const handleAuthState = () => {
            const isAuthPage = pathname === '/login' || pathname.startsWith('/ref/');
            const isAdminPage = pathname.startsWith('/admin');

            if (!user && !isAuthPage) {
                router.push('/login');
            } else if (user && isAuthPage) {
                router.push(isAdmin ? '/admin' : '/');
            } else if (user && !isAdmin && isAdminPage) {
                router.push('/');
            } else if (user && isAdmin && !isAdminPage) {
                router.push('/admin');
            }
        };

        // If loading is finished, handle the auth state.
        if (!loading) {
            handleAuthState();
        }
    }, [user, isAdmin, loading, pathname, router]);

    // --- Mock Functions ---
    const signInWithGoogle = async () => {
        toast({ title: 'Feature Not Implemented', description: 'Google Sign-In is disabled in this prototype.' });
    };

    const signUpWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        toast({ title: 'Account Created (Prototype)!', description: 'You can now log in.' });
        // Simulate a successful signup
        setTimeout(() => setLoading(false), 500);
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);

        // Simulate a login attempt
        setTimeout(() => {
            if (email === 'admin@example.com') {
                setUser(MOCK_ADMIN_USER as User);
                setUserData(null);
                setIsAdmin(true);
            } else {
                setUser({ email } as User);
                setUserData(MOCK_USER_DATA);
                setIsAdmin(false);
            }
            setLoading(false);
        }, 500);
    };

    const sendPasswordReset = async (email: string) => {
        toast({ title: 'Password Reset Link Sent (Prototype)' });
    };
    
    const mockAction = async (actionName: string) => {
        toast({ title: 'Prototype Mode', description: `${actionName} is for demonstration only.` });
    };
    
    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const value: AuthContextType = {
        user,
        userData,
        loading,
        isAdmin,
        totalROI,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        updateUserPhone: (phone) => mockAction(`Updating phone to ${phone}`),
        updateUserName: (name) => mockAction(`Updating name to ${name}`),
        claimDailyBonus: (amount) => mockAction(`Claiming ${amount} Rs. bonus`),
        collectSignupBonus: () => mockAction('Collecting sign-up bonus'),
        sendPasswordReset,
    };
    
    if (loading && pathname !== '/login' && !pathname.startsWith('/ref/')) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading...</p>
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
