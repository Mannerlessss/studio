'use client';
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ArrowRight } from 'lucide-react';

export const UpgradeCard: FC = () => {
    const { userData } = useAuth();
    
    if (userData?.membership === 'Pro') {
        return null;
    }

  return (
    <Card className="shadow-md border border-accent bg-accent/5">
        <CardHeader>
            <CardTitle className="text-accent text-lg">Upgrade to PRO Plan</CardTitle>
            <CardDescription>
                Increase your daily earnings from 10% to 20%!
            </CardDescription>
        </CardHeader>
      <CardContent>
            <Link href="/pro" className='w-full'>
                <Button className="w-full" size="lg">
                    View PRO Benefits <ArrowRight className="ml-2"/>
                </Button>
            </Link>
      </CardContent>
    </Card>
  );
};
