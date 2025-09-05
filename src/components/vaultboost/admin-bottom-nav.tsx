
'use client';
import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandCoins, Users, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AdminBottomNav: FC = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/admin/withdrawals', icon: HandCoins, label: 'Withdrawals' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/offers', icon: Gift, label: 'Offers' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
           const isActive = pathname === item.href;
           return (
              <Link href={item.href} key={item.label} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                      'flex flex-col items-center justify-center h-full w-full rounded-none',
                      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
           )
        })}
      </div>
    </div>
  );
};
