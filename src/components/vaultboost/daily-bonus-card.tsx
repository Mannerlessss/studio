'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DailyBonusCard: FC = () => {
  const [claimed, setClaimed] = useState(false);
  const { toast } = useToast();

  const handleClaim = () => {
    setClaimed(true);
    toast({
      title: 'Bonus Claimed!',
      description: 'You have successfully claimed your daily bonus of $5.00.',
    });
  };

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-lg">
                <Gift className="w-8 h-8 text-accent" />
            </div>
            <div>
                <CardTitle>Daily Bonus</CardTitle>
                <CardDescription>Claim your reward every 24 hours.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          Engage with the platform daily to earn extra rewards. Your bonus is waiting for you!
        </p>
        <Button
          onClick={handleClaim}
          disabled={claimed}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          {claimed ? 'Claimed for Today' : 'Claim Your $5.00 Bonus'}
        </Button>
      </CardContent>
    </Card>
  );
};
