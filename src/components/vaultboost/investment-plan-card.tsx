import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InvestmentPlanCardProps {
  amount: number;
  dailyReturn: number;
  dailyReturnPercentage: number;
  proReturnPercentage?: number;
  duration: number;
  mostPurchased?: boolean;
  badgeText?: string;
  userName?: string;
}

export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  amount,
  dailyReturn,
  dailyReturnPercentage,
  proReturnPercentage,
  duration,
  mostPurchased = false,
  badgeText = 'Popular',
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
        <CardTitle className={cn('text-2xl font-bold', mostPurchased ? 'text-primary' : '')}>Plan {amount} Rs.</CardTitle>
        <CardDescription>
          Invest {amount} Rs. and get {dailyReturnPercentage}% daily.
          {proReturnPercentage && <span className="text-accent font-semibold"> (PRO: {proReturnPercentage.toFixed(1)}%)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Daily Earning</span>
          <span className="font-semibold">{dailyReturn.toFixed(2)} Rs.</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Contract Days</span>
          <span className="font-semibold">{duration} Days</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-muted-foreground font-semibold">Total Profit</span>
          <span className="font-bold text-green-500">{totalProfit.toFixed(2)} Rs.</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={whatsappUrl} className="w-full" target="_blank">
            <Button className="w-full" size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Invest Now
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
