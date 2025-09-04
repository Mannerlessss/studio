'use client';
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const UpgradeCard: FC = () => {
  return (
    <Card className="shadow-md border border-accent bg-accent/5">
        <CardHeader>
            <CardTitle className="text-accent text-lg">Upgrade to PRO Plan</CardTitle>
            <CardDescription>
                Increase your daily earnings to 13%!
            </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm">Basic Plan:</p>
                <p className="text-sm font-semibold">10% daily returns</p>
            </div>
            <div className="flex justify-between items-center text-accent">
                <p className="text-sm font-semibold">PRO Plan:</p>
                <p className="text-sm font-bold">13% daily returns</p>
            </div>
            <Button className="w-full" size="lg">Upgrade for 99 Rs</Button>
        </div>
      </CardContent>
    </Card>
  );
};
