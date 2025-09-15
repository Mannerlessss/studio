'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

// This page will capture the referral code from the URL,
// store it in localStorage, and redirect to the signup page.
export default function ReferralPage({ params }: { params: { code: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (params.code) {
      // Store the referral code so the signup page can use it
      localStorage.setItem('referralCode', params.code);
      // Redirect to the main login/signup page
      router.push('/login');
    } else {
        // If no code, just go to login
        router.push('/login');
    }
  }, [params.code, router]);

  // Render a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <DiamondLogo className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
        <p className="text-lg text-muted-foreground">Applying referral code...</p>
      </div>
    </div>
  );
}
