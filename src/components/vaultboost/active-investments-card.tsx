'use client';
import { FC, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth, Investment } from '@/contexts/auth-context';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';


const getColorForPlan = (amount: number) => {
    if (amount < 500) return 'from-yellow-400 to-orange-500';
    if (amount < 2000) return 'from-teal-400 to-blue-500';
    if (amount < 10000) return 'from-purple-400 to-pink-500';
    return 'from-red-500 to-rose-500';
}

const InvestmentCarouselItem: FC<{ investment: Investment }> = ({ investment }) => {
    
    const totalProfit = investment.durationDays * investment.dailyReturn;
    const progress = (investment.daysProcessed / investment.durationDays) * 100;
    const colorClass = getColorForPlan(investment.planAmount);

    return (
        <CarouselItem>
            <div className={cn("p-4 rounded-xl text-white shadow-lg", colorClass)}>
                <div className='flex justify-between items-start'>
                    <div>
                        <p className='text-sm opacity-80'>Plan Active</p>
                        <p className='text-2xl font-bold'>{investment.planAmount.toLocaleString('en-IN')} Rs.</p>
                    </div>
                     <Badge variant="secondary" className="bg-white/20 border-none">
                        Daily: {investment.dailyReturn.toLocaleString('en-IN')} Rs.
                    </Badge>
                </div>
                
                <div className='mt-6 space-y-4'>
                    <div className='flex justify-between items-end'>
                        <div>
                             <p className='text-sm opacity-80 flex items-center gap-1'><TrendingUp className='w-4 h-4'/> Profit</p>
                            <p className='text-xl font-semibold'>{investment.earnings.toLocaleString('en-IN')} Rs.</p>
                        </div>
                        <div className='text-right'>
                             <p className='text-sm opacity-80 flex items-center gap-1 justify-end'><Target className='w-4 h-4'/> Total</p>
                            <p className='text-lg font-medium'>{totalProfit.toLocaleString('en-IN')} Rs.</p>
                        </div>
                    </div>

                     <div>
                        <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                        <div className="flex justify-between items-center text-xs mt-1 opacity-90">
                            <p>Progress: {progress.toFixed(0)}%</p>
                            <p className='flex items-center gap-1'><Calendar className='w-3 h-3'/>{investment.daysProcessed}/{investment.durationDays} Days</p>
                        </div>
                    </div>
                </div>
            </div>
        </CarouselItem>
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
        <Carousel
            opts={{
                align: "start",
                loop: activeInvestments.length > 1,
            }}
            className="w-full"
            >
            <CarouselContent>
                {activeInvestments.map(inv => (
                    <InvestmentCarouselItem key={inv.id} investment={inv} />
                ))}
            </CarouselContent>
             {activeInvestments.length > 1 && (
                <>
                    <CarouselPrevious className="ml-2 bg-background/80 hover:bg-background" />
                    <CarouselNext className="mr-2 bg-background/80 hover:bg-background" />
                </>
            )}
        </Carousel>
      </CardContent>
    </Card>
  );
};
