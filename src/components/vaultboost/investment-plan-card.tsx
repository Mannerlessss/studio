'use client';
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InvestmentPlanCardProps {
  amount: number;
  originalAmount?: number;
  dailyReturn: number;
  duration: number;
  mostPurchased?: boolean;
  badgeText?: string;
  userName?: string;
}

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nextSunday = new Date();
            nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
            nextSunday.setHours(23, 59, 59, 999);

            const difference = nextSunday.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('Offer Expired');
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-destructive mt-2">
            <Clock className="w-4 h-4" />
            <span>Offer ends in: {timeLeft}</span>
        </div>
    );
};


export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  amount,
  originalAmount,
  dailyReturn,
  duration,
  mostPurchased = false,
  badgeText = 'Most Purchased',
  userName = 'User',
}) => {
  const totalProfit = dailyReturn * duration;
  const message = `Hi, I'm ${userName} and I want to buy the plan for ${amount} Rs.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;
  const displayAmount = originalAmount || amount;

  return (
    <Card className={cn('shadow-lg relative overflow-hidden', mostPurchased ? 'border-primary border-2' : '')}>
      {mostPurchased && (
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          <Star className="w-3 h-3 mr-1" />
          {badgeText}
        </Badge>
      )}
      <CardHeader>
        <div className="flex items-baseline gap-2">
            <CardTitle className={cn('text-2xl font-bold', mostPurchased ? 'text-primary' : '')}>Plan {displayAmount} Rs.</CardTitle>
            {originalAmount && (
                <p className="text-lg font-semibold text-muted-foreground line-through">{originalAmount} Rs.</p>
            )}
        </div>
        <CardDescription>Invest and get 10% daily return on the original plan amount.</CardDescription>
        <CountdownTimer />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Daily Earning</span>
          <span className="font-semibold">{dailyReturn} Rs.</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Contract Days</span>
          <span className="font-semibold">{duration} Days</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-muted-foreground font-semibold">Total Profit</span>
          <span className="font-bold text-green-500">{totalProfit} Rs.</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={whatsappUrl} className="w-full" target="_blank">
            <Button className="w-full" size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Invest Now for {amount} Rs.
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
