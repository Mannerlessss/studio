
'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { Timestamp } from 'firebase/firestore';

export const ActiveInvestmentsCard: FC = () => {
    const { userData } = useAuth();

    const investedAmount = userData?.invested || 0;
    const investmentEarnings = userData?.investmentEarnings || 0;
    const dailyReturnRate = userData?.membership === 'Pro' ? 0.13 : 0.10;
    const dailyEarning = investedAmount * dailyReturnRate;
    
    const investmentStartDate = userData?.lastInvestmentUpdate ? userData.lastInvestmentUpdate : null;
    
    const daysElapsed = useMemo(() => {
        if (!investmentStartDate || dailyEarning <= 0) return 0;
        // Calculate days elapsed based on earnings to be precise
        const elapsed = Math.floor(investmentEarnings / dailyEarning);
        return Math.min(elapsed, 30); // Cap at 30 days
    }, [investmentEarnings, dailyEarning, investmentStartDate]);

    const progress = (daysElapsed / 30) * 100;

    if (investedAmount <= 0) {
        return null;
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Investments</CardTitle>
        <CardDescription>Your current investment performance</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 border relative">
                <div className="grid grid-cols-2 gap-y-4">
                    <div>
                        <p className="text-2xl font-bold text-primary">{investedAmount.toLocaleString()} Rs.</p>
                        <p className="text-sm text-muted-foreground">Investment Active</p>
                    </div>
                    <div className='text-right'>
                        <p className="text-2xl font-bold text-green-500">{investmentEarnings.toLocaleString()} Rs.</p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                    </div>
                </div>

                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white shadow-lg">{dailyReturnRate * 100}% Daily</Badge>
                </div>

                <div className="mt-4 col-span-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p>Progress</p>
                        <p>{progress.toFixed(1)}%</p>
                    </div>
                    <Progress value={progress} />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <p>Day {daysElapsed} of 30</p>
                        <p>Daily: {dailyEarning.toLocaleString()} Rs.</p>
                    </div>
                </div>
          </div>
      </CardContent>
    </Card>
  );
};
