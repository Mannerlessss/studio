
'use client';
import { useState } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Gift, Shield, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const SettingsPage: NextPage = () => {
    const { userData, logOut, redeemReferralCode } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [referralCodeInput, setReferralCodeInput] = useState('');
    const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        }
    }

    const handleRedeem = async () => {
        if (!referralCodeInput) {
            toast({
                variant: 'destructive',
                title: 'No Code Entered',
                description: 'Please enter a referral code.',
            });
            return;
        }

        try {
            await redeemReferralCode(referralCodeInput);
            setShowRedeemSuccess(true);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Redemption Failed',
                description: error.message || 'This code is invalid or has already been used.',
            });
        }
    }

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">My Account</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
               <Input id="full-name" defaultValue={userData?.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phone-number" placeholder="Enter your phone number" defaultValue={userData?.phone} />
                <Button>Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-accent" />
              <CardTitle>Redeem a Code</CardTitle>
            </div>
            <CardDescription>
              {userData?.usedReferralCode 
                ? "You have already redeemed a referral code." 
                : "Enter a friend's referral code to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="offer-code">Referral Code</Label>
              <div className="flex gap-2">
                <Input 
                  id="offer-code" 
                  placeholder="FRIENDSCODE" 
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  disabled={userData?.usedReferralCode}
                />
                <Button 
                  variant="secondary"
                  onClick={handleRedeem}
                  disabled={userData?.usedReferralCode}
                >
                  Redeem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle>Account Security</CardTitle>
            </div>
             <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-semibold">{userData?.email}</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
            </div>
            <div className="flex justify-between items-center">
                 <div>
                    <p className="text-sm text-muted-foreground">Your Referral Code</p>
                    <p className="font-semibold">{userData?.referralCode || 'N/A'}</p>
                </div>
                {userData?.referralCode && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Active</Badge>}
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
        </Button>

      </div>
      <BottomNav activePage="settings" />

      {/* Success Dialog */}
       <AlertDialog open={showRedeemSuccess} onOpenChange={setShowRedeemSuccess}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Code Redeemed Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                That's a great start! Now, make your first investment to get your 75 Rs. welcome bonus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push('/investment')}>Invest Now</AlertDialogCancel>
              <AlertDialogAction onClick={() => setShowRedeemSuccess(false)}>
                Maybe Later
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default SettingsPage;
