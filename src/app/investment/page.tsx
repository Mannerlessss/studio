'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

const InvestmentPage: NextPage = () => {
  const plans = [
    { id: 'vip1', title: 'VIP1 Welfare', amount: 150, dailyReturn: 15, duration: 30 },
    { id: 'vip2', title: 'VIP2 Welfare', amount: 300, originalAmount: 400, dailyReturn: 40, duration: 30, mostPurchased: true },
    { id: 'vip3', title: 'VIP3 Welfare', amount: 400, originalAmount: 500, dailyReturn: 50, duration: 30, mostPurchased: true },
    { id: 'vip4', title: 'VIP4 Welfare', amount: 1000, dailyReturn: 100, duration: 30 },
    { id: 'vip5', title: 'VIP5 Welfare', amount: 1600, originalAmount: 2000, dailyReturn: 200, duration: 30, mostPurchased: true },
    { id: 'vip6', title: 'VIP6 Welfare', amount: 4000, originalAmount: 5000, dailyReturn: 500, duration: 30 },
    { id: 'vip7', title: 'VIP7 Special', amount: 10000, dailyReturn: 5000, duration: 4, mostPurchased: true }
  ];
  const { userData } = useAuth();
  const userName = userData?.name || 'User';

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Tabs defaultValue="welfare">
          <TabsList className="grid w-full grid-cols-3 bg-muted/80">
            <TabsTrigger value="fixed">Fixed Fund</TabsTrigger>
            <TabsTrigger value="welfare" className="relative">
              Welfare Fund
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">HOT</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity">Activity Fund</TabsTrigger>
          </TabsList>
          <TabsContent value="welfare" className="mt-6 space-y-4">
            {plans.map((plan) => (
              <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
            ))}
          </TabsContent>
          <TabsContent value="fixed">
             <p className="text-center text-muted-foreground p-8">No fixed funds available at the moment.</p>
          </TabsContent>
           <TabsContent value="activity">
             <p className="text-center text-muted-foreground p-8">No activity funds available at the moment.</p>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
