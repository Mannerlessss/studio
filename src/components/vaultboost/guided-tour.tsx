'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';

const tourSteps = [
  {
    title: 'Welcome to VaultBoost!',
    content: 'Let\'s take a quick tour of the app to get you started.',
    targetId: 'welcome-card',
  },
  {
    title: 'Your Dashboard',
    content: 'Here you can see your key stats like invested amount, earnings, and referrals at a glance.',
    targetId: 'info-cards',
  },
  {
    title: 'Investment Plans',
    content: 'Head over to the Investment page to see available plans and start earning.',
    targetId: 'bottom-nav-investment',
  },
  {
    title: 'Refer & Earn',
    content: 'Invite your friends using your unique code from the Refer page and earn commissions!',
    targetId: 'bottom-nav-refer',
  },
    {
    title: 'Withdraw Funds',
    content: 'Easily withdraw your earnings. We\'ll guide you through the process here.',
    targetId: 'withdraw-card',
  },
];

export function GuidedTour() {
  const [step, setStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('vaultboost-tour-completed');
    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleEndTour();
    }
  };

  const handleEndTour = () => {
    setShowTour(false);
    localStorage.setItem('vaultboost-tour-completed', 'true');
  };

  if (!showTour) {
    return null;
  }

  const currentStep = tourSteps[step];
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
       <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
                        <p className="text-sm text-muted-foreground">{currentStep.content}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleEndTour}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-muted-foreground">
                        {step + 1} / {tourSteps.length}
                    </span>
                    <Button size="sm" onClick={handleNext}>
                       {step === tourSteps.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
