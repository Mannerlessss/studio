'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiamondLogo } from '@/components/vaultboost/diamond-logo';

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
