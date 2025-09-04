'use client';
import type { NextPage } from 'next';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';

const ProPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="p-4 space-y-6">
        <UpgradeCard />
        <WithdrawCard />
        <TransactionHistoryCard />
      </div>
      <BottomNav activePage="pro" />
    </div>
  );
};

export default ProPage;
