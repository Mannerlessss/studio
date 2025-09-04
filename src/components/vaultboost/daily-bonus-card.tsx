'use client';
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

export const DailyBonusCard: FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-accent" />
          <CardTitle className="text-lg font-semibold">Daily Bonus Game</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">Bonus already claimed today!</p>
        <p className="text-muted-foreground">Come back tomorrow for another bonus.</p>
      </CardContent>
    </Card>
  );
};
