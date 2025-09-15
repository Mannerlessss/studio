'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';

export const ProfileCompletionCard: FC = () => {
  const { userData } = useAuth();

  const completionPercent = useMemo(() => {
    if (!userData) return 0;
    let score = 0;
    const totalFields = 3; // name, phone, email
    if (userData.name && userData.name !== 'Vault User') score++;
    if (userData.phone) score++;
    if (userData.email) score++;
    return Math.round((score / totalFields) * 100);
  }, [userData]);

  if (completionPercent === 100) {
    return null; // Don't show the card if the profile is complete
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-primary" />
          <CardTitle className="text-lg font-semibold">Complete Your Profile</CardTitle>
        </div>
        <CardDescription>
          A complete profile helps us secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Profile Completion</p>
            <p className="text-sm font-bold text-primary">{completionPercent}%</p>
          </div>
          <Progress value={completionPercent} />
        </div>
        <Link href="/settings">
          <Button className="w-full" variant="secondary">
            Go to Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
