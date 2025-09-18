'use client';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Gift, Users, Star, Share2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { clientDb } from '@/lib/firebaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { ReferralMilestonesCard } from '@/components/vaultboost/referral-milestones-card';

interface ReferredUser {
    id: string;
    name: string;
    email: string;
    hasInvested: boolean;
}

const ReferPage: NextPage = () => {
    const { toast } = useToast();
    const { user, userData } = useAuth();
    const [referralStats, setReferralStats] = useState({
        totalReferred: 0,
        successfullyInvested: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);
    
    const referralCode = userData?.referralCode || '...';
    const referralLink = `https://vaultboost.app/ref/${referralCode}`;
    const shareMessage = `Check out VaultBoost! I'm earning money by investing. Join using my code and you can earn too! My referral code is ${referralCode}. Link: ${referralLink}`;

    useEffect(() => {
        if (!user) return;

        const referralsRef = collection(clientDb, `users/${user.uid}/referrals`);
        const q = query(referralsRef);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const referredUsers = querySnapshot.docs.map(doc => doc.data() as ReferredUser);
            const totalReferred = referredUsers.length;
            const successfullyInvested = referredUsers.filter(u => u.hasInvested).length;
            
            setReferralStats({
                totalReferred,
                successfullyInvested
            });
            setLoadingStats(false);
        }, (error) => {
            console.error("Failed to fetch referrals:", error);
            setLoadingStats(false);
        });

        return () => unsubscribe();
    }, [user]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copied to clipboard!",
            description: "Your referral code has been copied.",
        });
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(shareMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    const shareAnywhere = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on VaultBoost!',
                    text: shareMessage,
                    url: referralLink,
                });
            } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to copying link if sharing fails
                copyToClipboard();
                toast({
                    title: "Sharing failed, link copied instead.",
                });
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyToClipboard();
            toast({
                title: "Web Share not supported, link copied instead.",
            });
        }
    };


  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6 text-center">
        <h2 className="text-2xl font-bold">Turn your network into your net worth!</h2>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary">
          <p className="text-xl font-bold text-foreground">Earn <span className="font-bold text-primary">151 Rs.</span> for every friend who joins the action.</p>
        </div>
        <p className="flex items-center justify-center gap-2 text-accent font-semibold">
            <Star className="w-5 h-5" />
            Unlimited Earning Potential
            <Star className="w-5 h-5" />
        </p>

        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card">
                <CardContent className="p-4">
                    {loadingStats ? <Skeleton className="h-8 w-1/2 mx-auto" /> : <p className="text-3xl font-bold">{referralStats.totalReferred}</p>}
                    <p className="text-xs flex items-center justify-center gap-1"><Users className='w-3 h-3'/> Total Referred</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="p-4">
                    {loadingStats ? <Skeleton className="h-8 w-1/2 mx-auto" /> : <p className="text-3xl font-bold">{userData?.investedReferralCount || 0}</p>}
                    <p className="text-xs flex items-center justify-center gap-1"><Star className='w-3 h-3' /> Successfully Invested</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="p-4">
                    {userData ? <p className="text-3xl font-bold">{userData?.totalReferralEarnings || 0} <span className='text-xl'>Rs.</span></p> : <Skeleton className="h-8 w-1/2 mx-auto" />}
                    <p className="text-xs flex items-center justify-center gap-1"><Gift className='w-3 h-3' /> Total Earnings</p>
                </CardContent>
            </Card>
        </div>


        <Card className="text-center shadow-lg border border-primary">
            <CardHeader>
                <div className='flex justify-center items-center gap-3 mb-2'>
                    <Gift className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-bold">Your Magic Code</CardTitle>
                    <Badge>Premium</Badge>
                </div>
                <CardDescription>Share this golden ticket with friends and watch your earnings grow!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-muted-foreground mb-2 text-sm">Your Referral Code</p>
                    <div className="flex items-center justify-center p-3 border-dashed border-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-mono font-bold tracking-widest mr-4">{referralCode}</p>
                        <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                            <Copy className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>

                <div className='space-y-3 pt-2'>
                    <Button className='w-full' size='lg' onClick={shareOnWhatsApp}>
                        <MessageCircle className='mr-2'/>
                        Share on WhatsApp
                    </Button>
                    <Button className='w-full' variant='secondary' size='lg' onClick={shareAnywhere}>
                        <Share2 className='mr-2'/>
                        Share Anywhere
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <ReferralMilestonesCard successfullyInvested={userData?.investedReferralCount || 0} />

         <Card className="text-left shadow-lg">
            <CardHeader>
                <CardTitle>How The Magic Happens</CardTitle>
            </CardHeader>
             <CardContent className="text-sm text-muted-foreground space-y-3">
                 <p>1. Share your referral code with your friends.</p>
                 <p>2. Your friend signs up and invests at least 100 Rs. in a plan.</p>
                 <p>3. You get a <span className='font-bold text-primary'>151 Rs.</span> bonus instantly! (Only after your friend's first investment of 100 Rs. or more)</p>
                 <p>4. You also get a <span className='font-bold text-primary'>3% commission</span> on all their future earnings, forever!</p>
             </CardContent>
        </Card>
      </div>
      <BottomNav activePage="refer" />
    </div>
  );
};

export default ReferPage;

    