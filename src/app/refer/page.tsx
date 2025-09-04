
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Gift, Percent, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReferPage: NextPage = () => {
    const { toast } = useToast();
    const referralLink = 'https://vaultboost.app/ref/nikhil123';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast({
            title: "Copied to clipboard!",
            description: "Your referral link has been copied.",
        });
    };

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card className="text-center bg-card shadow-lg">
            <CardHeader>
                <div className='flex justify-center items-center mb-4'>
                    <Award className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-3xl font-bold">Refer & Earn Big</CardTitle>
                <CardDescription>Invite your friends and earn rewards when they invest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <Card className="bg-muted/30">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <Gift className="w-8 h-8 text-primary" />
                            <CardTitle className="text-lg">Direct Bonus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">75 Rs.</p>
                            <p className="text-xs text-muted-foreground">For every friend who makes their first investment.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                           <Percent className="w-8 h-8 text-primary" />
                           <CardTitle className="text-lg">Lifetime Commission</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-2xl font-bold">3%</p>
                           <p className="text-xs text-muted-foreground">Of the earnings from all your referred friends.</p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <p className="text-muted-foreground mb-2">Your unique referral link:</p>
                    <div className="flex items-center justify-center p-3 border-dashed border-2 rounded-lg bg-muted">
                        <p className="text-sm font-mono truncate mr-4">{referralLink}</p>
                        <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                            <Copy className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t border-border/50">
                    <div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-muted-foreground flex items-center justify-center gap-2"><Users className="h-4 w-4" /> Friends Joined</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">0 Rs.</p>
                        <p className="text-muted-foreground">Total Referral Earnings</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
      <BottomNav activePage="refer" />
    </div>
  );
};

export default ReferPage;
