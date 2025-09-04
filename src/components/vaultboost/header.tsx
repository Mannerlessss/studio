
import type { FC } from 'react';
import { MessageCircle, Crown, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Header: FC = () => {
  const pathname = usePathname();
  const isReferPage = pathname === '/refer';
  const headerClasses = isReferPage ? 'bg-transparent text-white' : 'bg-card text-foreground';
  const buttonClasses = isReferPage ? 'text-white hover:bg-white/20 hover:text-white' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground';
  const iconColor = 'text-primary';
  const proIconColor = 'text-primary';

  return (
    <header className={`flex items-center justify-between p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-3">
        <Gem className={`w-8 h-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/support">
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <MessageCircle className="h-5 w-5" />
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
