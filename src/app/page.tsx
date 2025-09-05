'use client';
import type { NextPage } from 'next';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, PiggyBank } from 'lucide-react';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { Header } from '@/components/vaultboost/header';
import { useAuth } from '@/contexts/auth-context';
import { GuidedTour } from '@/components/vaultboost/guided-tour';
import { ProfileCompletionCard } from '@/components/vaultboost/profile-completion-card';


const Home: NextPage = () => {
  const { userData, loading } = useAuth();

  if (loading || !userData) {
      return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
  }
  
  const handleBonusClaim = (amount: number) => {
    // This will be updated to modify Firestore data
    console.log(`Claimed ${amount} bonus`);
  };

  return (
    <div className="bg-background min-h-full">
      <Header />
      <GuidedTour />
      <div className="p-4 space-y-6">
        <div id="welcome-card">
          <WelcomeCard name={userData.name} membership={`${userData.membership} Member`} />
        </div>
        <ProfileCompletionCard />
        <div className="grid grid-cols-2 gap-4" id="info-cards">
          <InfoCard
            title="Invested"
            value={`${userData.invested} Rs.`}
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Earnings"
            value={`${userData.earnings} Rs.`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
           <InfoCard
            title="Projected"
            value={`${userData.projected} Rs.`}
            icon={<PiggyBank className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Referral"
            value={`${userData.referralEarnings} Rs.`}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
        </div>
        <DailyBonusCard onBonusClaim={handleBonusClaim} />
        <div id="withdraw-card">
            <WithdrawCard />
        </div>
        <TransactionHistoryCard />
        <UpgradeCard userName={userData.name}/>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default Home;
