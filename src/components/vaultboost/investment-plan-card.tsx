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
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const calculateTimeLeft = () => {
            const now = new Date();
            const nextSunday = new Date();
            // Set to next Sunday 23:59:59
            nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
            nextSunday.setHours(23, 59, 59, 999);

            const difference = nextSunday.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                 setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call
        return () => clearInterval(timer);
    }, []);

    if (!isClient) {
        return null; // Don't render on the server to avoid hydration mismatch
    }

    return (
        <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
            <div className="flex items-center justify-center gap-1.5 text-center">
                <Clock className="w-4 h-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">Offer Ends In:</p>
            </div>
            <div className="text-center font-mono text-lg font-bold tracking-widest">
                {`${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
            </div>
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

  return (
    <Card className={cn('shadow-lg relative overflow-hidden', mostPurchased ? 'border-primary border-2' : '')}>
      {mostPurchased && (
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          <Star className="w-3 h-3 mr-1" />
          {badgeText}
        </Badge>
      )}
      <CardHeader>
        <div className="flex items-baseline justify-center text-center gap-2">
            <CardTitle className={cn('text-2xl font-bold', originalAmount ? 'text-primary' : '')}>{amount} Rs.</CardTitle>
            {originalAmount && (
                <p className="text-lg font-semibold text-muted-foreground line-through">{originalAmount} Rs.</p>
            )}
        </div>
        <CardDescription className="text-center">Invest {originalAmount || amount} Rs. and get 10% daily return.</CardDescription>
        {originalAmount && <CountdownTimer />}
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
