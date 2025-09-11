
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
    hasInvested: boolean; // New field
    lastBonusClaim?: Timestamp;
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
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "gagansharma.gs107@gmail.com";

const generateReferralCode = (name: string) => `${name.slice(0, 5).toUpperCase()}${Math.random().toString(36).substring(2, 6)}`;

const createNewUserData = (user: User, extraData?: { name?: string, phone?: string, referralCode?: string }): UserData => ({
    uid: user.uid,
    name: extraData?.name || user.displayName || 'Vault User',
    email: user.email || '',
    phone: extraData?.phone || user.phoneNumber || '',
    referralCode: generateReferralCode(extraData?.name || user.displayName || 'USER'),
    membership: 'Basic',
    rank: 'Bronze',
    totalBalance: 0,
    invested: 0,
    earnings: 0,
    projected: 0,
    referralEarnings: 0,
    bonusEarnings: 0,
    investmentEarnings: 0,
    hasInvested: false,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
});

const handleAdminClaim = async (user: User) => {
    if (user.email === ADMIN_EMAIL) {
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh
        if (idTokenResult.claims.admin !== true) {
            const adminRequestRef = collection(db, "admin_requests");
            await addDoc(adminRequestRef, { uid: user.uid, email: user.email, requestedAt: serverTimestamp() });
            console.log('Admin role request triggered for', user.email);
        }
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isInitialising, setIsInitialising] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    useEffect(() => {
        let unsubscribeDoc: Unsubscribe | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setIsInitialising(true); // Reset initialising state on user change
            if (unsubscribeDoc) {
                unsubscribeDoc();
            }

            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, 'users', currentUser.uid);
                
                unsubscribeDoc = onSnapshot(userDocRef, async (userDocSnap) => {
                    if (userDocSnap.exists()) {
                        const dbData = userDocSnap.data() as UserData;
                        setUserData(dbData);
                        await updateDoc(userDocRef, { lastLogin: serverTimestamp() }).catch(err => console.error("Failed to update last login", err));
                        await handleAdminClaim(currentUser); 
                    } else {
                        // If user is logged in but doc doesn't exist, it might be a new sign up.
                        // The handleSuccessfulSignUp function will set the data.
                        // We will set userData to null temporarily.
                        setUserData(null);
                    }
                    setIsInitialising(false);
                }, (error) => {
                    console.error("Auth Snapshot Error:", error);
                    setUserData(null);
                    setIsInitialising(false);
                });
            } else {
                setUser(null);
                setUserData(null);
                setIsInitialising(false); 
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) {
                unsubscribeDoc();
            }
        };
    }, []);
    
    useEffect(() => {
        if (isInitialising) {
            return; // Wait until initial auth check is done
        }
    
        const isAuthPage = pathname.startsWith('/login');
        const isAdminPage = pathname.startsWith('/admin');
        const isPublicPage = ['/terms', '/privacy', '/support'].includes(pathname);

        if (user) {
            if (userData) { // Only check for admin/redirect when userData is loaded
                const isAdmin = userData.email === ADMIN_EMAIL; // Simple check for routing
                 if (isAdmin) {
                    if (!isAdminPage) router.push('/admin');
                } else {
                    if (isAdminPage) router.push('/');
                }
                if (isAuthPage) {
                    router.push(isAdmin ? '/admin' : '/');
                }
            }
            // If user exists but no userData, we wait, maybe it's being created.
        } else {
             if (!isAuthPage && !isPublicPage) {
                router.push('/login');
            }
        }
    
    }, [user, userData, isInitialising, pathname, router]);

    const handleSuccessfulSignUp = async (loggedInUser: User, extraData: { name: string, phone: string, referralCode?: string }) => {
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        let newUser = createNewUserData(loggedInUser, extraData);
        
        if (extraData.referralCode) {
             try {
                const q = query(collection(db, "users"), where("referralCode", "==", extraData.referralCode.toUpperCase()));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const referrerDoc = querySnapshot.docs[0];
                    if(referrerDoc.id !== loggedInUser.uid) {
                        newUser.usedReferralCode = extraData.referralCode.toUpperCase();
                        newUser.referredBy = referrerDoc.id;
                    }
                }
            } catch (e) {
                console.error("Error finding referrer on signup:", e);
            }
        }
        
        await setDoc(userDocRef, newUser);
        // Snapshot listener will pick this up and set state, so no need to setUserData here.
        await handleAdminClaim(loggedInUser);
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const userDocRef = doc(db, 'users', result.user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                await handleSuccessfulSignUp(result.user, { name: result.user.displayName || 'Google User', phone: result.user.phoneNumber || '' });
            }
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: 'destructive',
                    title: 'Google Sign-In Failed',
                    description: error.message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async ({ name, email, password, phone, referralCode }: any) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await handleSuccessfulSignUp(userCredential.user, { name, phone, referralCode });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-Up Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        } finally {
            setLoading(false);
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
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { name });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
            throw error;
        }
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("No user is logged in.");
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { phone });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
            throw error;
        }
    };
    
    const claimDailyBonus = async (amount: number) => {
        if (!user || !userData) return;
        
        try {
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
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Claim Failed',
                description: 'Could not update your balance. Please try again.',
            });
        }
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
        loading: isInitialising || loading,
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
    
    if (isInitialising || (user && !userData && !pathname.startsWith('/login'))) {
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

    