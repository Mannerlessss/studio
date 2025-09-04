import type { NextPage } from 'next';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, Star } from 'lucide-react';

const Home: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="p-4 space-y-6">
        <WelcomeCard name="Nikhil" membership="Basic Member" />
        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            title="Invested"
            value="₹0"
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Earnings"
            value="₹0"
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          />
          <InfoCard
            title="Referral"
            value="₹0"
            icon={<Users className="h-6 w-6 text-yellow-500" />}
          />
          <InfoCard
            title="Status"
            value="Basic"
            icon={<Star className="h-6 w-6 text-orange-500" />}
            isStatus
          />
        </div>
        <DailyBonusCard />
        <UpgradeCard />
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
