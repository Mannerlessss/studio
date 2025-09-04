
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
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
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="text-2xl">Refer & Earn</CardTitle>
                <CardDescription>Invite your friends and earn rewards when they invest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Your unique referral link:</p>
                <div className="flex items-center justify-center p-3 border-dashed border-2 rounded-lg bg-muted">
                    <p className="text-sm font-mono truncate mr-4">{referralLink}</p>
                    <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                        <Copy className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center pt-4">
                    <div>
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-muted-foreground">Friends Joined</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">0 Rs.</p>
                        <p className="text-muted-foreground">Total Earnings</p>
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
