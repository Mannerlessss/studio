'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth, Investment } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const InvestmentItem: FC<{ investment: Investment }> = ({ investment }) => {
    
    // Fallback to 0 if values are undefined/null
    const perMinuteReturn = (investment as any).dailyReturn || 0;
    const durationMinutes = (investment as any).durationMinutes || 30;

    const minutesProcessed = perMinuteReturn > 0 ? Math.round(investment.earnings / perMinuteReturn) : 0;
    const progress = durationMinutes > 0 ? (minutesProcessed / durationMinutes) * 100 : 0;
    const dailyReturnEquivalent = perMinuteReturn * 60 * 24;
    const dailyReturnRate = investment.planAmount > 0 ? (dailyReturnEquivalent / investment.planAmount) * 100 : 0;

    return (
        <div className="p-4 rounded-lg bg-muted/50 border relative">
            <div className="grid grid-cols-2 gap-y-4">
                <div>
                    <p className="text-2xl font-bold text-primary">{investment.planAmount.toLocaleString()} Rs.</p>
                    <p className="text-sm text-muted-foreground">Plan Active</p>
                </div>
                <div className='text-right'>
                    <p className="text-2xl font-bold text-green-500">{investment.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Rs.</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                 <Badge className="bg-blue-500 text-white shadow-lg">{!isNaN(dailyReturnRate) ? dailyReturnRate.toFixed(0) : 0}% Daily</Badge>
            </div>

            <div className="mt-4 col-span-2 space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <p>Progress</p>
                    <p>{progress.toFixed(0)}%</p>
                </div>
                <Progress value={progress} />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <p>Minute {minutesProcessed} of {durationMinutes}</p>
                    <p>Per Min: {perMinuteReturn.toFixed(4)} Rs.</p>
                </div>
            </div>
        </div>
    );
};

export const ActiveInvestmentsCard: FC = () => {
    const { userData } = useAuth();
    const activeInvestments = useMemo(() => {
        return userData?.investments?.filter(inv => inv.status === 'active') || [];
    }, [userData?.investments]);

    if (activeInvestments.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Active Investments</CardTitle>
                    <CardDescription>Your current investment performance</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-10">
                    <TrendingUp className="mx-auto w-12 h-12 mb-4" />
                    <p className="font-semibold">No Active Investments</p>
                    <p className="text-sm mb-4">Start investing to see your earnings grow.</p>
                    <Link href="/investment">
                        <Button>View Investment Plans</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Investments</CardTitle>
        <CardDescription>Your current investment performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeInvestments.map(inv => (
            <InvestmentItem key={inv.id} investment={inv} />
        ))}
      </CardContent>
    </Card>
  );
};
