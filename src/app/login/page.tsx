
'use client';
import { useState } from 'react';
import { Gem, Lock, Mail, Phone, User, Users } from 'lucide-react';
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

export default function LoginPage() {
    const { signInWithGoogle, signUpWithEmail, signInWithEmail, loading } = useAuth();
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

    const GoogleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.626 6 24 6C13.49 6 5 14.49 5 25s8.49 19 19 19s19-8.49 19-19c0-1.838-.27-3.626-.789-5.333z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.12C34.553 8.246 29.626 6 24 6C16.3 6 9.682 10.182 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.786 44 30.825 44 25c0-1.838-.27-3.626-.789-5.333z" />
        </svg>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-6 space-y-4">
          <Gem className="w-12 h-12 text-primary" />
          <h1 className="text-2xl font-bold tracking-widest text-primary">
            U P I V A U L T B O O S T
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
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                    {loading ? 'Signing In...' : 'Login'}
                </Button>
                <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
                    <GoogleIcon /> Sign In with Google
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
                <Label htmlFor="referral">Referral Code (Optional)</Label>
                 <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="referral" placeholder="FRIENDSCODE" className="pl-10" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} disabled={loading}/>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                 <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
                     <GoogleIcon /> Sign Up with Google
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
