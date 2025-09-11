
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    User,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getDocs, query, where, collection, updateDoc, writeBatch, Timestamp, onSnapshot, Unsubscribe, addDoc } from 'firebase/firestore';
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
    hasInvested: boolean;
    lastBonusClaim?: Timestamp;
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

const ADMIN_EMAIL = "gagansharma.gs107@gmail.com";

const generateReferralCode = (name: string) => `${name.slice(0, 5).toUpperCase()}${Math.random().toString(36).substring(2, 6)}`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // This now represents the initial auth check
    const [actionLoading, setActionLoading] = useState(false); // For specific actions like login/logout
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        let unsubscribeDoc: Unsubscribe | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (unsubscribeDoc) unsubscribeDoc();
            
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                const userDocRef = doc(db, 'users', currentUser.uid);
                unsubscribeDoc = onSnapshot(userDocRef, (userDocSnap) => {
                    if (userDocSnap.exists()) {
                        setUserData(userDocSnap.data() as UserData);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Auth Snapshot Error:", error);
                    setUserData(null);
                    setLoading(false);
                });

            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                if (unsubscribeDoc) unsubscribeDoc();
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);
    
    useEffect(() => {
        if (loading) return; // Wait until authentication state is resolved

        const isAuthPage = pathname === '/login';
        const isUserPage = !isAuthPage && !pathname.startsWith('/admin');
        const isAdminPage = pathname.startsWith('/admin');

        // If not logged in, redirect from protected pages to login
        if (!user) {
            if (isUserPage || isAdminPage) {
                router.push('/login');
            }
            return;
        }

        // If logged in, handle redirects
        if (isAuthPage) {
            router.push(isAdmin ? '/admin' : '/');
        } else if (isAdminPage && !isAdmin) {
            router.push('/');
        } else if (isUserPage && isAdmin) {
            if (!['/terms', '/privacy', '/support'].includes(pathname)) {
                 router.push('/admin');
            }
        }
    }, [user, isAdmin, loading, pathname, router]);

    const getOrCreateUserDocument = async (loggedInUser: User, extraData: { name?: string, phone?: string, referralCode?: string } = {}) => {
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
        } else {
             const newName = extraData.name || loggedInUser.displayName || 'Vault User';
             const referralCode = generateReferralCode(newName);
            
            let newUserData: Omit<UserData, 'referralCode' | 'usedReferralCode' | 'referredBy' | 'hasInvested' | 'lastBonusClaim' | 'projected' | 'earnings' | 'investmentEarnings'> & {referralCode: string, usedReferralCode?: string, referredBy?: string} = {
                uid: loggedInUser.uid,
                name: newName,
                email: loggedInUser.email || '',
                phone: extraData.phone || loggedInUser.phoneNumber || '',
                membership: 'Basic',
                rank: 'Bronze',
                totalBalance: 0,
                invested: 0,
                referralEarnings: 0,
                bonusEarnings: 0,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                referralCode
            };

            if (extraData.referralCode) {
                 try {
                    const q = query(collection(db, "users"), where("referralCode", "==", extraData.referralCode.toUpperCase()));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        if(referrerDoc.id !== loggedInUser.uid) {
                            newUserData.usedReferralCode = extraData.referralCode.toUpperCase();
                            newUserData.referredBy = referrerDoc.id;
                        }
                    }
                } catch (e) {
                    console.error("Error finding referrer on signup:", e);
                }
            }
            await setDoc(userDocRef, newUserData);
        }
         // Request admin claim if email matches
        if (loggedInUser.email === ADMIN_EMAIL) {
            const adminRequestRef = collection(db, "admin_requests");
            await addDoc(adminRequestRef, { uid: loggedInUser.uid, email: loggedInUser.email, requestedAt: serverTimestamp() });
        }
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setActionLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            await getOrCreateUserDocument(result.user, { name: result.user.displayName || undefined, phone: result.user.phoneNumber || undefined });
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: 'destructive',
                    title: 'Google Sign-In Failed',
                    description: error.message,
                });
            }
        } finally {
            setActionLoading(false);
        }
    };

    const signUpWithEmail = async ({ name, email, password, phone, referralCode }: any) => {
        setActionLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await getOrCreateUserDocument(userCredential.user, { name, phone, referralCode });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-Up Failed',
                description: error.message,
            });
            setActionLoading(false); // only on error
        }
        // No finally here, as onAuthStateChanged will handle loading state
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setActionLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await getOrCreateUserDocument(userCredential.user);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
             setActionLoading(false); // only on error
        }
        // No finally here, as onAuthStateChanged will handle loading state
    };

    const logOut = async () => {
        setActionLoading(true);
        try {
            await signOut(auth);
            // onAuthStateChanged handles the state updates
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const redeemReferralCode = async (code: string) => {
        if (!user || !userData || userData.referredBy) {
            throw new Error("Action not allowed. You may have already used a code.");
        }

        const batch = writeBatch(db);
        const q = query(collection(db, "users"), where("referralCode", "==", code.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
            throw new Error("This code is invalid or belongs to you.");
        }

        const referrerDoc = querySnapshot.docs[0];
        
        const userDocRef = doc(db, 'users', user.uid);
        batch.update(userDocRef, {
            usedReferralCode: code.toUpperCase(),
            referredBy: referrerDoc.id,
        });
        
        const referrerReferralsRef = doc(collection(db, 'users', referrerDoc.id, 'referrals'), user.uid);
        batch.set(referrerReferralsRef, {
            userId: user.uid,
            name: userData.name,
            email: userData.email,
            date: serverTimestamp(),
            hasInvested: false
        });

        await batch.commit();
    };

    const updateUserName = async (name: string) => {
        if (!user) throw new Error("No user is logged in.");
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { name });
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("No user is logged in.");
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { phone });
    };
    
    const claimDailyBonus = async (amount: number) => {
        if (!user || !userData) return;
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: (userData.totalBalance || 0) + amount,
            bonusEarnings: (userData.bonusEarnings || 0) + amount,
            earnings: (userData.earnings || 0) + amount,
            lastBonusClaim: serverTimestamp(),
        });
        
        const transactionsColRef = collection(db, `users/${user.uid}/transactions`);
        batch.set(doc(transactionsColRef), {
            type: 'bonus',
            amount: amount,
            description: 'Daily Bonus Claim',
            status: 'Completed',
            date: serverTimestamp(),
        });

        await batch.commit();
        toast({
            title: 'Bonus Claimed!',
            description: `You've received ${amount} Rs.`,
        });
    }
    
    const sendPasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Password Reset Email Sent',
                description: `A reset link has been sent to ${email}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Reset Failed',
                description: error.message,
            });
        }
    };

    const value: AuthContextType = {
        user,
        userData,
        loading: actionLoading, // Use actionLoading for button states etc.
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
    
    if (loading) { // This is the initial, full-page loading screen
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading VaultBoost...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
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
