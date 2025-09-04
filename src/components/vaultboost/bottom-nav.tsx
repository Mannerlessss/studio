import type { FC } from 'react';
import { LayoutDashboard, TrendingUp, Star, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BottomNav: FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Investment' },
    { icon: Star, label: 'Pro Plan' },
    { icon: Users, label: 'Refer' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full rounded-none ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
