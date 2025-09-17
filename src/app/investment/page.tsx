'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

const InvestmentPage: NextPage = () => {
  const welfarePlans = [
    { id: 'vip1', title: 'VIP1 Welfare', amount: 150, dailyReturn: 15, duration: 30 },
    { id: 'vip2', title: 'VIP2 Welfare', amount: 300, originalAmount: 400, dailyReturn: 40, duration: 30, mostPurchased: true },
    { id: 'vip3', title: 'VIP3 Welfare', amount: 400, originalAmount: 500, dailyReturn: 50, duration: 30, mostPurchased: true },
    { id: 'vip4', title: 'VIP4 Welfare', amount: 1000, dailyReturn: 100, duration: 30 },
    { id: 'vip5', title: 'VIP5 Welfare', amount: 1600, originalAmount: 2000, dailyReturn: 200, duration: 30, mostPurchased: true },
    { id: 'vip6', title: 'VIP6 Welfare', amount: 4000, originalAmount: 5000, dailyReturn: 500, duration: 30 },
    { id: 'vip7', title: 'VIP7 Special', amount: 10000, dailyReturn: 5000, duration: 4, mostPurchased: true }
  ];

  const fixedPlans = [
     { id: 'sip1', title: 'Monthly SIP 2500', monthlyInvestment: 2500, amount: 30000, totalReturn: 100000, duration: 365 },
     { id: 'sip2', title: 'Monthly SIP 5000', monthlyInvestment: 5000, amount: 60000, totalReturn: 250000, duration: 365 },
  ];

  const activityPlans = [
    { id: 'act1', title: 'Activity Fund 10K', amount: 10000, totalReturn: 30000, duration: 4 },
    { id: 'act2', title: 'Activity Fund 25K', amount: 25000, totalReturn: 75000, duration: 4 },
    { id: 'act3', title: 'Activity Fund 50K', amount: 50000, totalReturn: 150000, duration: 4 },
    { id: 'act4', title: 'Activity Fund 100K', amount: 100000, totalReturn: 300000, duration: 4 },
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
            {welfarePlans.map((plan) => (
              <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
            ))}
          </TabsContent>
          <TabsContent value="fixed" className="mt-6 space-y-4">
             {fixedPlans.map((plan) => (
              <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
            ))}
          </TabsContent>
           <TabsContent value="activity" className="mt-6 space-y-4">
             {activityPlans.map((plan) => (
                <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
