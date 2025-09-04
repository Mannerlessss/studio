
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Fab } from '@/components/vaultboost/fab';

const InvestmentPage: NextPage = () => {
  const plans = [
    { amount: 100, dailyReturn: 10, duration: 30, mostPurchased: true, badgeText: 'Everyone Buys' },
    { amount: 300, dailyReturn: 30, duration: 30 },
    { amount: 500, dailyReturn: 50, duration: 30 },
    { amount: 1000, dailyReturn: 100, duration: 30 },
    { amount: 2000, dailyReturn: 200, duration: 30 },
  ];

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Investment Plans</h2>
        {plans.map((plan, index) => (
          <InvestmentPlanCard key={index} {...plan} />
        ))}
      </div>
      <Fab />
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
