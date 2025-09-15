'use client';
import type { FC } from 'react';
import { Headset, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DiamondLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-8 h-8", className)}
    >
      <path d="M12.0006 18.26L4.94057 10.29L12.0006 2.40997L19.0606 10.29L12.0006 18.26ZM12.0006 21.59L21.5906 10.82L12.0006 0.0500488L2.41057 10.82L12.0006 21.59Z" />
    </svg>
  );
};

export const Header: FC = () => {
  const pathname = usePathname();
  const isReferPage = pathname === '/refer';
  const headerClasses = 'bg-card text-foreground';
  const buttonClasses = 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground';
  const iconColor = 'text-primary';
  const proIconColor = 'text-primary';

  return (
    <header className={`flex items-center justify-between p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-3">
        <DiamondLogo className={`w-8 h-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/support">
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <Headset className="h-5 w-5" />
            <span className="sr-only">Customer Support</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className={buttonClasses}>
          <Crown className={`h-5 w-5 ${proIconColor}`} />
          <span className="sr-only">Pro Plan</span>
        </Button>
      </div>
    </header>
  );
};
