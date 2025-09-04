import type { FC } from 'react';
import { Crown } from 'lucide-react';

interface WelcomeCardProps {
  name: string;
  membership: string;
}

export const WelcomeCard: FC<WelcomeCardProps> = ({ name, membership }) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-400 p-6 text-black shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-3">
          <Crown className="h-8 w-8 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
          <p className="text-sm opacity-90">
            {membership} • The treasure awaits
          </p>
        </div>
      </div>
    </div>
  );
};
