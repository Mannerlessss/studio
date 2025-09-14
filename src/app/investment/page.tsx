'use client';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface InvestmentPlan {
  id: string;
  amount: number;
  dailyReturnPercentage: number;
  durationDays: number;
  isPopular: boolean;
}

const InvestmentPage: NextPage = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const userName = userData?.name || 'User';
  const isProMember = userData?.membership === 'Pro';

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'investmentPlans'), orderBy('amount', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedPlans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentPlan));
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching investment plans: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Investment Plans</h2>

        {loading ? (
           Array.from({ length: 3 }).map((_, index) => (
             <Card key={index}>
               <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
               <CardContent className="space-y-4">
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-10 w-full" />
               </CardContent>
             </Card>
           ))
        ) : plans.length > 0 ? (
          plans.map((plan) => {
            const baseDailyReturn = (plan.amount * plan.dailyReturnPercentage) / 100;
            const proBonus = isProMember ? baseDailyReturn * 0.30 : 0; // 30% bonus on the daily return for Pro
            const finalDailyReturn = baseDailyReturn + proBonus;

            return (
              <InvestmentPlanCard
                key={plan.id}
                amount={plan.amount}
                dailyReturn={finalDailyReturn}
                dailyReturnPercentage={plan.dailyReturnPercentage}
                proReturnPercentage={isProMember ? plan.dailyReturnPercentage * 1.3 : undefined}
                duration={plan.durationDays}
                mostPurchased={plan.isPopular}
                userName={userName}
              />
            );
          })
        ) : (
          <Card className="text-center py-10">
            <CardContent>
              <p>No investment plans are available at the moment. Please check back later.</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50 border-dashed">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-muted-foreground" />
                    <CardTitle className="text-lg font-semibold">Please Note</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Daily earnings are credited to your account every 24 hours based on your plan.</p>
                <p>• Pro members receive a 30% bonus on daily returns on all investment plans.</p>
                <p>• All investment plans expire automatically after their duration is complete.</p>
            </CardContent>
        </Card>

      </div>
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
