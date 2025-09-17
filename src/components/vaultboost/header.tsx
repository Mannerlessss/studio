'use client';
import type { FC } from 'react';
import { Headset, Crown, Gem } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Header: FC = () => {
  const headerClasses = 'bg-card text-foreground';
  const iconColor = 'text-primary';
  
  return (
    <header className={`flex items-center justify-between p-3 md:p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-2 md:gap-3">
        <Gem className={`w-7 h-7 md:w-8 md:h-8 ${iconColor}`} />
        <h1 className="text-xl md:text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/support" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground')}>
          <Headset className="h-5 w-5" />
          <span className="sr-only">Customer Support</span>
        </Link>
        <Link href="/pro" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground')}>
          <Crown className={`h-5 w-5 text-primary`} />
          <span className="sr-only">Pro Plan</span>
        </Link>
      </div>
    </header>
  );
};
