'use client';
import { FC } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import Link from 'next/link';

interface InvestmentPlanCardProps {
  title: string;
  amount: number;
  dailyReturn?: number;
  totalReturn?: number;
  monthlyInvestment?: number;
  duration: number;
  userName?: string;
  originalAmount?: number;
  mostPurchased?: boolean;
}

export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  title,
  amount,
  dailyReturn,
  totalReturn,
  monthlyInvestment,
  duration,
  userName = 'User',
}) => {
  const totalProfit = totalReturn || (dailyReturn ? dailyReturn * duration : 0);
  const message = `Hi, I'm ${userName} and I want to buy the ${title} plan for ${amount} Rs.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between bg-primary p-2 text-primary-foreground">
            <h3 className="font-bold text-lg">{title}</h3>
            <Link href={whatsappUrl} target="_blank">
                <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">Buy</Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-muted rounded-lg">
            <Gem className="w-12 h-12 text-primary" />
        </div>
        <div className="w-full space-y-2 text-sm">
            {monthlyInvestment ? (
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Price</span>
                    <span className="font-semibold">{monthlyInvestment} Rs.</span>
                </div>
            ) : (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Each Price</span>
                    <span className="font-semibold">{amount} Rs.</span>
                </div>
            )}
             <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-semibold">{duration} Days</span>
            </div>
            {dailyReturn && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Earnings</span>
                    <span className="font-semibold">{dailyReturn} Rs.</span>
                </div>
            )}
             <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold">{totalProfit} Rs.</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
