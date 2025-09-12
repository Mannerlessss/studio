
'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';

export const ActiveInvestmentsCard: FC = () => {
    const { userData } = useAuth();

    const investedAmount = userData?.invested || 0;
    const investmentEarnings = userData?.investmentEarnings || 0;
    const totalEarned = investedAmount + investmentEarnings;
    const dailyReturnRate = userData?.membership === 'Pro' ? 0.13 : 0.10;
    const dailyEarning = investedAmount * dailyReturnRate;
    
    const investmentStartDate = useMemo(() => {
        // This is a simplification. In a real app, you'd store and retrieve the actual start date.
        // For now, we'll estimate based on earnings.
        if (dailyEarning <= 0) return null;
        const daysElapsed = Math.floor(investmentEarnings / dailyEarning);
        const date = new Date();
        date.setDate(date.getDate() - daysElapsed);
        return date;
    }, [investmentEarnings, dailyEarning]);
    
    const daysElapsed = useMemo(() => {
        if (!investmentStartDate) return 0;
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - investmentStartDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.min(diffDays, 30); // Cap at 30 days
    }, [investmentStartDate]);

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
                        <p className="text-2xl font-bold text-primary">₹{investedAmount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Investment Active</p>
                    </div>
                    <div className='text-right'>
                        <p className="text-2xl font-bold text-green-500">₹{totalEarned.toLocaleString()}</p>
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
                        <p>Daily: ₹{dailyEarning.toLocaleString()}</p>
                    </div>
                </div>
          </div>
      </CardContent>
    </Card>
  );
};
