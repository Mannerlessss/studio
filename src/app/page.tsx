'use client';
import type { NextPage } from 'next';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, PiggyBank, Gem } from 'lucide-react';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { Header } from '@/components/vaultboost/header';
import { useAuth } from '@/contexts/auth-context';
import { GuidedTour } from '@/components/vaultboost/guided-tour';
import { ProfileCompletionCard } from '@/components/vaultboost/profile-completion-card';
import { AnnouncementPopup } from '@/components/vaultboost/announcement-popup';
import { ActiveInvestmentsCard } from '@/components/vaultboost/active-investments-card';
import { CollectBonusCard } from '@/components/vaultboost/collect-bonus-card';
import { SpecialOfferPopup } from '@/components/vaultboost/special-offer-popup';


const Dashboard: NextPage = () => {
  const { userData, loading, claimDailyBonus, totalROI } = useAuth();

  if (loading || !userData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
            </div>
        </div>
      );
  }
  
  const handleBonusClaim = (amount: number) => {
    claimDailyBonus(amount);
  };
  
  return (
    <div className="bg-background min-h-full">
      <Header />
      <AnnouncementPopup />
      <SpecialOfferPopup />
      <GuidedTour />
      <div className="p-4 space-y-6">
        <div id="welcome-card">
          <WelcomeCard name={userData.name} membership={`${userData.membership} Member`} />
        </div>
        <CollectBonusCard />
        <ProfileCompletionCard />
        <div className="grid grid-cols-2 gap-4" id="info-cards">
          <InfoCard
            title="Invested"
            value={`${userData.totalInvested || 0} Rs.`}
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Earnings"
            value={`${(userData.totalEarnings || 0).toLocaleString('en-IN')} Rs.`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
           <InfoCard
            title="Total ROI"
            value={`${totalROI.toLocaleString('en-IN')} Rs.`}
            icon={<PiggyBank className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Referral"
            value={`${(userData.totalReferralEarnings || 0).toLocaleString('en-IN')} Rs.`}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
        </div>
        <ActiveInvestmentsCard />
        <DailyBonusCard onBonusClaim={handleBonusClaim} />
        <div id="withdraw-card">
            <WithdrawCard />
        </div>
        <TransactionHistoryCard />
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default Dashboard;
