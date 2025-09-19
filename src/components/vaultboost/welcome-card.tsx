'use client';
import type { FC } from 'react';
import { Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface WelcomeCardProps {
  name: string;
}

export const WelcomeCard: FC<WelcomeCardProps> = ({ name }) => {
  const { userData } = useAuth();
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-400 p-4 md:p-6 text-black shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/20 p-2">
          <Crown className="h-6 w-6 text-black" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">Welcome, {name}!</h1>
          <p className="text-xs md:text-sm opacity-90 flex items-center gap-2">
            <span>{userData?.membership} Member</span>
            {userData?.rank && (
                <>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className='w-4 h-4'/> {userData.rank} Rank
                </span>
                </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
