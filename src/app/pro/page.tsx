'use client';
import type { NextPage } from 'next';
import { BottomNav } from '@/components/vaultboost/bottom-nav';

const ProPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="p-4 space-y-6">
        {/* Content moved to dashboard */}
      </div>
      <BottomNav activePage="pro" />
    </div>
  );
};

export default ProPage;
