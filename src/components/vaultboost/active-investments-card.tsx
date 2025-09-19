'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth, Investment } from '@/contexts/auth-context';
import { TrendingUp, Calendar, Target, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { cn } from '@/lib/utils';


const planColors = [
    "bg-blue-500/10 border-blue-500/50",
    "bg-purple-500/10 border-purple-500/50",
    "bg-green-500/10 border-green-500/50",
    "bg-orange-500/10 border-orange-500/50",
    "bg-red-500/10 border-red-500/50",
];

const InvestmentItem: FC<{ investment: Investment, index: number }> = ({ investment, index }) => {
    
    const progress = (investment.daysProcessed / investment.durationDays) * 100;
    const totalPotentialProfit = investment.dailyReturn * investment.durationDays;
    const colorClass = planColors[index % planColors.length];

    return (
        <div className={cn("p-4 rounded-lg border-2", colorClass)}>
            <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm text-muted-foreground">Plan Amount</p>
                    <p className="text-2xl font-bold text-foreground">{investment.planAmount.toLocaleString()} Rs.</p>
                </div>
                 <div className='text-right'>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-2xl font-bold text-green-500">{investment.earnings.toLocaleString()} Rs.</p>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                <Progress value={progress} />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3"/>
                        <span>Day {investment.daysProcessed} of {investment.durationDays}</span>
                    </div>
                     <div className="flex items-center gap-1">
                        <CircleDollarSign className="w-3 h-3"/>
                        <span>Daily: {investment.dailyReturn.toLocaleString()} Rs.</span>
                    </div>
                </div>
                 <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Target className="w-3 h-3"/>
                        <span>Potential Profit: {totalPotentialProfit.toLocaleString()} Rs.</span>
                    </div>
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
      <CardContent>
        <Carousel opts={{
            align: "start",
            loop: activeInvestments.length > 1,
        }}>
            <CarouselContent>
                {activeInvestments.map((inv, index) => (
                    <CarouselItem key={inv.id}>
                        <InvestmentItem investment={inv} index={index} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            {activeInvestments.length > 1 && (
                <>
                    <CarouselPrevious className="hidden sm:flex -left-4" />
                    <CarouselNext className="hidden sm:flex -right-4" />
                </>
            )}
        </Carousel>
      </CardContent>
    </Card>
  );
};
