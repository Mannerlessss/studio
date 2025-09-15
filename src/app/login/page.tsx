'use client';
import { useState, useEffect } from 'react';
import { Lock, Mail, Phone, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const DiamondLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-8 h-8", className)}
    >
      <path d="M12.0006 18.26L4.94057 10.29L12.0006 2.40997L19.0606 10.29L12.0006 18.26ZM12.0006 21.59L21.5906 10.82L12.0006 0.0500488L2.41057 10.82L12.0006 21.59Z" />
    </svg>
  );
};

export default function LoginPage() {
    const { signUpWithEmail, signInWithEmail, loading, sendPasswordReset } = useAuth();
    const { toast } = useToast();

    // Signup state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('');

    useEffect(() => {
        const storedReferralCode = localStorage.getItem('referralCode');
        if (storedReferralCode) {
            setReferralCode(storedReferralCode);
        }
    }, []);


    const handleSignUp = async () => {
        if (!name || !email || !password || !phone) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all required fields.',
            });
            return;
        }
        await signUpWithEmail({ name, email, phone, password, referralCode });
    };

     const handleSignIn = async () => {
        if (!loginEmail || !loginPassword) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please enter your email and password.',
            });
            return;
        }
        await signInWithEmail({ email: loginEmail, password: loginPassword });
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
            toast({
                variant: 'destructive',
                title: 'Email Required',
                description: 'Please enter your email address.',
            });
            return;
        }
        await sendPasswordReset(resetEmail);
        setResetEmail(''); // Clear the input after sending
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
       <AlertDialog>
        <Tabs defaultValue="login" className="w-full max-w-md">
            <div className="flex flex-col items-center justify-center mb-6 space-y-4">
            <DiamondLogo className="w-12 h-12 text-primary" />
            <h1 className="text-2xl font-bold tracking-widest text-primary">
                VAULTBOOST
            </h1>
            </div>
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
            <Card>
                <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to your VaultBoost account to continue.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="your@email.com" className="pl-10" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={loading} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="login-password" type="password" placeholder="••••••••" className="pl-10" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                 <div className="text-right">
                    <AlertDialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
                            Forgot Password?
                        </Button>
                    </AlertDialogTrigger>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </Button>
                </CardFooter>
            </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
            <Card>
                <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                    Join VaultBoost and start growing your investments today.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="name" placeholder="John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="your@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="referral-code" placeholder="e.g. FRIEND123" className="pl-10" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        
        {/* Forgot Password Dialog */}
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Forgot Your Password?</AlertDialogTitle>
            <AlertDialogDescription>
                No problem. Enter your email address below and we'll send you a link to reset it.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}
