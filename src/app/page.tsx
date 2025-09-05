'use client';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The onAuthStateChanged listener in AuthProvider will handle navigation
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-In Failed',
        description: error.message || 'Could not sign in with Google.',
      });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-3 mb-8">
        <Gem className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="w-full max-w-sm text-center">
         <p className='text-muted-foreground mb-6'>Welcome! Sign in to continue.</p>
         <Button 
            className="w-full h-12 text-base" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
             {loading ? (
                'Signing in...'
             ) : (
                <>
                    <GoogleIcon />
                    Sign in with Google
                </>
             )}
         </Button>
         <p className="text-xs text-muted-foreground mt-8">
            By signing in, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
         </p>
      </div>
    </div>
  );
}
