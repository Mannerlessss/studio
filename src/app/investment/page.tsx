'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const InvestmentPage: NextPage = () => {
    const welfarePlans = [
    { id: 'vip1', title: 'VIP1 Welfare', price: 150, days: 30, daily: 15, total: 450, color: "from-yellow-400 to-yellow-600", badge: "🥉 Bronze" },
    { id: 'vip2', title: 'VIP2 Welfare', price: 300, days: 30, daily: 40, total: 1200, color: "from-orange-400 to-orange-600", badge: "🥈 Silver" },
    { id: 'vip3', title: 'VIP3 Welfare', price: 400, days: 30, daily: 50, total: 1500, color: "from-red-500 to-yellow-500", badge: "🥇 Gold" },
    { id: 'vip4', title: 'VIP4 Welfare', price: 1000, days: 30, daily: 100, total: 3000, color: "from-purple-500 to-pink-500", badge: "🏆 Platinum" },
    { id: 'vip5', title: 'VIP5 Welfare', price: 1600, days: 30, daily: 200, total: 6000, color: "from-blue-500 to-cyan-500", badge: "💎 Diamond" },
    { id: 'vip6', title: 'VIP6 Welfare', price: 4000, days: 30, daily: 500, total: 15000, color: "from-green-500 to-teal-500", badge: "👑 Master" },
    { id: 'vip7', title: 'VIP7 Special', price: 10000, days: 4, daily: 5000, total: 20000, color: "from-indigo-500 to-violet-500", badge: "🔥 Special" },
  ];

  const fixedPlans = [
     { id: 'sip1', title: 'Monthly SIP 2500', price: 30000, days: 365, total: 100000, color: "from-slate-500 to-slate-700", badge: "🏦 Fixed", monthly: 2500 },
     { id: 'sip2', title: 'Monthly SIP 5000', price: 60000, days: 365, total: 250000, color: "from-gray-600 to-gray-800", badge: "🏦 Fixed", monthly: 5000 },
  ];

  const activityPlans = [
    { id: 'act1', title: 'Activity Fund 10K', price: 10000, days: 4, total: 30000, color: "from-rose-400 to-red-500", badge: "⚡️ Activity" },
    { id: 'act2', title: 'Activity Fund 25K', price: 25000, days: 4, total: 75000, color: "from-amber-400 to-orange-500", badge: "⚡️ Activity" },
    { id: 'act3', title: 'Activity Fund 50K', price: 50000, days: 4, total: 150000, color: "from-lime-400 to-green-500", badge: "⚡️ Activity" },
    { id: 'act4', title: 'Activity Fund 100K', price: 100000, days: 4, total: 300000, color: "from-cyan-400 to-blue-500", badge: "⚡️ Activity" },
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
          
          <TabsContent value="welfare" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {welfarePlans.map((plan) => (
                  <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="fixed" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fixedPlans.map((plan) => (
                <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
                ))}
            </div>
             <Card className="bg-muted/50 border-dashed">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Info className="w-6 h-6 text-muted-foreground" />
                        <CardTitle className="text-lg font-semibold">Please Note</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Fixed Fund plans work like a Systematic Investment Plan (SIP).</p>
                    <p>• You must pay the specified monthly amount for the duration of the plan to receive the total revenue at the end of the term.</p>
                </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="activity" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activityPlans.map((plan) => (
                    <InvestmentPlanCard key={plan.id} {...plan} userName={userName} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default InvestmentPage;
