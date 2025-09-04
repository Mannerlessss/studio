import type { FC } from 'react';
import { Bell, Settings, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Gem className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
};
