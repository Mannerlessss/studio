
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const InvestmentPage: NextPage = () => {
  const plans = [
    { amount: 100, dailyReturn: 10, duration: 30, mostPurchased: true, badgeText: 'Everyone Buys' },
    { amount: 300, dailyReturn: 30, duration: 30 },
    { amount: 500, dailyReturn: 50, duration: 30, mostPurchased: true, badgeText: 'Hot' },
    { amount: 1000, dailyReturn: 100, duration: 30 },
    { amount: 2000, dailyReturn: 200, duration: 30 },
  ];
  const { userData } = useAuth();
  const userName = userData?.name || 'User';

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Investment Plans</h2>
        {plans.map((plan, index) => (
          <InvestmentPlanCard key={index} {...plan} userName={userName} />
        ))}

        <Card className="bg-muted/50 border-dashed">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-muted-foreground" />
                    <CardTitle className="text-lg font-semibold">Please Note</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• All investment plans will automatically expire after 30 days from the date of purchase.</p>
                <p>• Daily earnings are credited to your account every 24 hours.</p>
            </CardContent>
        </Card>

      </div>
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
