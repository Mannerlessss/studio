
'use client';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Gift, Shield, LogOut, Loader2, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const SettingsPage: NextPage = () => {
    const { userData, logOut, updateUserPhone, updateUserName, redeemOfferCode } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [offerCode, setOfferCode] = useState('');

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

     const handleRedeemCode = async () => {
        if (!offerCode) {
            toast({ variant: 'destructive', title: 'Code Required', description: 'Please enter an offer code.' });
            return;
        }
        setIsRedeeming(true);
        try {
            await redeemOfferCode(offerCode.toUpperCase());
            setOfferCode(''); // Clear input on success
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Redemption Failed',
                description: error.message,
            });
        } finally {
            setIsRedeeming(false);
        }
    };

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

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-primary" />
              <CardTitle>Redeem Offer Code</CardTitle>
            </div>
            <CardDescription>
              Have a special code? Enter it here for a bonus!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., WELCOME100"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                disabled={isRedeeming}
              />
              <Button onClick={handleRedeemCode} disabled={isRedeeming || !offerCode}>
                {isRedeeming ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Redeem'
                )}
              </Button>
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
             {userData?.usedReferralCode && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Referred By Code
                  </p>
                  <p className="font-semibold">{userData.usedReferralCode}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                >
                  Applied
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
        </Button>

      </div>
      <BottomNav activePage="settings" />
    </div>
  );
};

export default SettingsPage;
