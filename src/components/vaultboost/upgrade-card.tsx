import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const UpgradeCard: FC = () => {
  return (
    <Card className="shadow-lg border-2 border-primary/50 bg-primary/5 overflow-hidden">
      <CardContent className="p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div className="flex-grow">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Upgrade to PRO</CardTitle>
          </div>
          <CardDescription className="mt-2 mb-6 max-w-2xl mx-auto sm:mx-0">
            Unlock exclusive benefits, higher earnings, and priority support. Take your investments to the next level!
          </CardDescription>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-left mb-6 sm:mb-0">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 2x Referral Bonus</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Higher Investment Limits</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Advanced Analytics</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Priority Support</li>
          </ul>
        </div>
        
        <div className="sm:ml-6 mt-6 sm:mt-0 flex-shrink-0 text-center sm:text-right">
          <p className="text-sm text-muted-foreground mb-2">Next level progress</p>
          <Progress value={66} className="w-full sm:w-48 mb-4 h-2" />
          <Button size="lg" className="w-full sm:w-auto group">
            Upgrade Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
