
import type { FC } from 'react';
import { Bell, Settings, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-transparent text-white">
      <div className="flex items-center gap-3">
        <Gem className="w-8 h-8 text-white" />
        <h1 className="text-2xl font-bold text-white font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className='text-white hover:bg-white/20 hover:text-white'>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className='text-white hover:bg-white/20 hover:text-white'>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
};
