import type { NextPage } from 'next';
import Image from 'next/image';
import { Header } from '@/components/vaultboost/header';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { PiggyBank, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Home: NextPage = () => {
  const user = {
    name: 'Jessica',
    membership: 'Basic',
  };

  const referrals = [
    { name: 'Alex', earnings: '$15.50', avatar: `https://picsum.photos/40/40?random=1`, hint: 'person portrait' },
    { name: 'Maria', earnings: '$12.00', avatar: `https://picsum.photos/40/40?random=2`, hint: 'person portrait' },
    { name: 'David', earnings: '$10.75', avatar: `https://picsum.photos/40/40?random=3`, hint: 'person portrait' },
    { name: 'Sophia', earnings: '$7.00', avatar: `https://picsum.photos/40/40?random=4`, hint: 'person portrait' },
    { name: 'Liam', earnings: '$5.00', avatar: `https://picsum.photos/40/40?random=5`, hint: 'person portrait' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold font-headline">Welcome back, {user.name}!</h1>
            <div className="text-muted-foreground flex items-center gap-2 mt-1">
              You are on the <Badge variant="outline" className="border-accent text-accent bg-accent/10">{user.membership}</Badge> plan.
            </div>
          </div>
          <Avatar className="h-12 w-12 lg:h-16 lg:w-16">
            <Image src="https://picsum.photos/100/100" width={100} height={100} alt="User Avatar" data-ai-hint="person portrait" className="rounded-full" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            title="Invested Amount"
            value="$1,250.00"
            icon={<PiggyBank className="h-8 w-8 text-primary" />}
            footerText="View Investment Portfolio"
          />
          <InfoCard
            title="Total Earnings"
            value="$350.75"
            icon={<TrendingUp className="h-8 w-8 text-green-500" />}
            footerText="+15% This Month"
          />
          <InfoCard
            title="Total Referrals"
            value="5"
            icon={<Users className="h-8 w-8 text-purple-500" />}
            footerText="Invite More Friends"
          />
          <InfoCard
            title="Membership"
            value="Basic"
            icon={<ShieldCheck className="h-8 w-8 text-orange-500" />}
            footerText="Active since Jan 2024"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DailyBonusCard />
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Recent Referral Activity</CardTitle>
                <CardDescription>Earnings from your invited friends.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {referrals.map((referral, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <Image src={referral.avatar} width={40} height={40} alt={referral.name} data-ai-hint={referral.hint} className="rounded-full" />
                          <AvatarFallback>{referral.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{referral.name}</p>
                          <p className="text-sm text-muted-foreground">Joined this week</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">+{referral.earnings}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <UpgradeCard />
        </div>
      </main>
    </div>
  );
};

export default Home;
