
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InvestmentPlanCardProps {
  amount: number;
  dailyReturn: number;
  duration: number;
  mostPurchased?: boolean;
}

export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  amount,
  dailyReturn,
  duration,
  mostPurchased = false,
}) => {
  const totalProfit = dailyReturn * duration;

  return (
    <Card className={cn('shadow-lg relative overflow-hidden', mostPurchased ? 'border-primary border-2' : '')}>
      {mostPurchased && (
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          <Star className="w-3 h-3 mr-1" />
          Most Purchased
        </Badge>
      )}
      <CardHeader>
        <CardTitle className={cn('text-2xl font-bold', mostPurchased ? 'text-primary' : '')}>Plan {amount} Rs.</CardTitle>
        <CardDescription>Invest {amount} Rs. and get 10% daily.</CardDescription>
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
        <Button className="w-full" size="lg">
          <Zap className="mr-2 h-4 w-4" />
          Invest Now
        </Button>
      </CardFooter>
    </Card>
  );
};
