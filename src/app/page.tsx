
'use client';
import type { NextPage } from 'next';
import { useState } from 'react';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, Star, PiggyBank } from 'lucide-react';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { Header } from '@/components/vaultboost/header';
import { useAuth } from '@/contexts/auth-context';
import { GuidedTour } from '@/components/vaultboost/guided-tour';
import { ProfileCompletionCard } from '@/components/vaultboost/profile-completion-card';


const Home: NextPage = () => {
  const [earnings, setEarnings] = useState(0);
  const { userData, loading } = useAuth();
  const userName = userData?.name || 'User';

  const handleBonusClaim = (amount: number) => {
    setEarnings((prevEarnings) => prevEarnings + amount);
  };

  if (loading) {
      return null;
  }

  return (
    <div className="bg-background min-h-full">
      <Header />
      <GuidedTour />
      <div className="p-4 space-y-6">
        <div id="welcome-card">
          <WelcomeCard name={userName} membership={userData?.membership ? `${userData.membership} Member` : 'Basic Member'} />
        </div>
        <ProfileCompletionCard />
        <div className="grid grid-cols-2 gap-4" id="info-cards">
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
            title="Projected"
            value="0 Rs."
            icon={<PiggyBank className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Referral"
            value="0 Rs."
            icon={<Users className="h-6 w-6 text-primary" />}
          />
        </div>
        <DailyBonusCard onBonusClaim={handleBonusClaim} />
        <div id="withdraw-card">
            <WithdrawCard />
        </div>
        <TransactionHistoryCard />
        <UpgradeCard userName={userName}/>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default Home;
