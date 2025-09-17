'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

const ProPage: NextPage = () => {
  const { userData } = useAuth();
  const userName = userData?.name || 'User';
  const message = `Hi, I'm ${userName} and I want to upgrade to the PRO plan for 4999 Rs.`;
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
                <CardDescription className="text-base">Unlock your full earning potential with a lifetime membership.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-muted-foreground">One-Time Lifetime Fee</p>
                    <p className="text-4xl font-bold">4999 <span className="text-2xl">Rs.</span></p>
                </div>

                <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">20% Daily Returns</p>
                            <p className="text-sm text-muted-foreground">Boost your daily earnings on all active and future investments from 10% to an incredible <span className="font-bold text-primary">20%</span>.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">Priority Support</p>
                            <p className="text-sm text-muted-foreground">Get faster responses from our customer support team for any queries.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                        <div>
                            <p className="font-semibold">Lifetime Membership</p>
                            <p className="text-sm text-muted-foreground">Pay once and enjoy the PRO benefits for a lifetime. No recurring fees.</p>
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
      <BottomNav activePage="pro" />
    </div>
  );
};

export default ProPage;
