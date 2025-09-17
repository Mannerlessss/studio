'use client';
import type { FC } from 'react';
import { Headset, Crown, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Header: FC = () => {
  const headerClasses = 'bg-card text-foreground';
  const buttonClasses = 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground';
  const iconColor = 'text-primary';
  
  return (
    <header className={`flex items-center justify-between p-3 md:p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-2 md:gap-3">
        <Gem className={`w-7 h-7 md:w-8 md:h-8 ${iconColor}`} />
        <h1 className="text-xl md:text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/support">
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <Headset className="h-5 w-5" />
            <span className="sr-only">Customer Support</span>
          </Button>
        </Link>
        <Link href="/pro">
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <Crown className={`h-5 w-5 text-primary`} />
            <span className="sr-only">Pro Plan</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
