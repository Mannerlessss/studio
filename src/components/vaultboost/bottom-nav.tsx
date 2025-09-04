import type { FC } from 'react';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavProps {
  activePage: 'dashboard' | 'investment' | 'refer' | 'settings';
}

export const BottomNav: FC<BottomNavProps> = ({ activePage }) => {
  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { href: '/investment', icon: TrendingUp, label: 'Investment', page: 'investment' },
    { href: '/refer', icon: Users, label: 'Refer', page: 'refer' },
    { href: '/settings', icon: Settings, label: 'Settings', page: 'settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label} className="flex-1">
            <Button
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full w-full rounded-none ${
                activePage === item.page
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};
