
import type { FC } from 'react';
import { Bell, Settings, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export const Header: FC = () => {
  const pathname = usePathname();
  const isReferPage = pathname === '/refer';
  const headerClasses = isReferPage ? 'bg-transparent text-white' : 'bg-card text-foreground';
  const buttonClasses = isReferPage ? 'text-white hover:bg-white/20 hover:text-white' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground';
  const iconColor = isReferPage ? 'text-white' : 'text-primary';

  return (
    <header className={`flex items-center justify-between p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-3">
        <Gem className={`w-8 h-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className={buttonClasses}>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className={buttonClasses}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
};
