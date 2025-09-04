'use client';
import type { NextPage } from 'next';
import { useState } from 'react';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, Star } from 'lucide-react';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { Header } from '@/components/vaultboost/header';
import { Fab } from '@/components/vaultboost/fab';


const Home: NextPage = () => {
  const [earnings, setEarnings] = useState(0);

  const handleBonusClaim = (amount: number) => {
    setEarnings((prevEarnings) => prevEarnings + amount);
  };

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <WelcomeCard name="Nikhil" membership="Basic Member" />
        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            title="Invested"
            value="0 Rs."
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Earnings"
            value={`${earnings} Rs.`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Referral"
            value="0 Rs."
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Status"
            value="Basic"
            icon={<Star className="h-6 w-6 text-primary" />}
            isStatus
          />
        </div>
        <DailyBonusCard onBonusClaim={handleBonusClaim} />
        <WithdrawCard />
        <TransactionHistoryCard />
        <UpgradeCard />
      </div>
      <Fab />
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default Home;
