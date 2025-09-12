
'use client';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Gift, Shield, LogOut, Loader2 } from 'lucide-react';
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
    const { userData, logOut, redeemReferralCode, updateUserPhone, updateUserName } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [referralCodeInput, setReferralCodeInput] = useState('');
    const [showRedeemSuccess, setShowRedeemSuccess] = useState(false);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
      if (userData) {
        setName(userData.name || '');
        setPhone(userData.phone || '');
      }
    }, [userData]);

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

    const handleUpdateName = async () => {
        if (!name || name === userData?.name) {
            return;
        }
        setIsUpdatingName(true);
        try {
            await updateUserName(name);
             toast({
                title: 'Success!',
                description: 'Your name has been updated.',
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleUpdatePhone = async () => {
        if (!phone || phone === userData?.phone) {
            return;
        }
        setIsUpdatingPhone(true);
        try {
            await updateUserPhone(phone);
             toast({
                title: 'Success!',
                description: 'Your phone number has been updated.',
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleRedeem = async () => {
        if (!referralCodeInput) {
            toast({
                variant: 'destructive',
                title: 'No Code Entered',
                description: 'Please enter a referral code.',
            });
            return;
        }
        setIsRedeeming(true);
        try {
            await redeemReferralCode(referralCodeInput);
            setShowRedeemSuccess(true);
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Redemption Failed',
                description: error.message || 'This code is invalid or has already been used.',
            });
        } finally {
            setIsRedeeming(false);
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
               <div className="flex gap-2">
                <Input id="full-name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleUpdateName} disabled={isUpdatingName || !name || name === userData?.name}>
                  {isUpdatingName ? <Loader2 className="animate-spin"/> : 'Update'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phone-number" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button onClick={handleUpdatePhone} disabled={isUpdatingPhone || !phone || phone === userData?.phone}>
                  {isUpdatingPhone ? <Loader2 className="animate-spin"/> : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-accent" />
              <CardTitle>Used a Referral Code?</CardTitle>
            </div>
            <CardDescription>
              {userData?.usedReferralCode 
                ? "You have already redeemed a friend's referral code." 
                : "If a friend referred you, enter their code here to link your accounts."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="offer-code">Friend's Referral Code</Label>
              <div className="flex gap-2">
                <Input 
                  id="offer-code" 
                  placeholder={userData?.usedReferralCode || "FRIENDSCODE"} 
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  disabled={!!userData?.usedReferralCode || isRedeeming}
                />
                <Button 
                  variant="secondary"
                  onClick={handleRedeem}
                  disabled={!!userData?.usedReferralCode || isRedeeming || !referralCodeInput}
                >
                  {isRedeeming ? <Loader2 className="animate-spin"/> : 'Redeem'}
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
                Your account is now linked to your friend. Make your first investment to get your welcome bonus!
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
