'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, CheckCircle, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const ProPage: NextPage = () => {
  const { userData } = useAuth();
  const userName = userData?.name || 'User';
  const message = `Hi, I'm ${userName} and I want to upgrade to the PRO plan for 99 Rs.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card className="shadow-lg border-2 border-primary bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="text-center items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-2">
                    <Crown className="w-10 h-10 text-primary"/>
                </div>
                <CardTitle className="text-3xl font-bold text-primary">VaultBoost PRO</CardTitle>
                <CardDescription className="text-base">Unlock your full earning potential.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-muted-foreground">One-time Upgrade Fee</p>
                    <p className="text-4xl font-bold">99 <span className="text-2xl">Rs.</span></p>
                </div>

                <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">Boosted Daily Returns</p>
                            <p className="text-sm text-muted-foreground">Increase your daily earnings on all active and future investments from 10% to <span className="font-bold text-primary">13%</span>.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">Priority Support</p>
                            <p className="text-sm text-muted-foreground">Get faster responses from our customer support team.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">Exclusive Future Perks</p>
                            <p className="text-sm text-muted-foreground">Receive early access to new features and special investment plans.</p>
                        </div>
                    </div>
                </div>
                
                <Link href={whatsappUrl} className='w-full' target='_blank'>
                    <Button className="w-full" size="lg">
                        <Zap className="mr-2" /> Upgrade Now & Earn More
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default ProPage;
