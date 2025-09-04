import type { FC } from 'react';
import { Crown } from 'lucide-react';

interface WelcomeCardProps {
  name: string;
  membership: string;
}

export const WelcomeCard: FC<WelcomeCardProps> = ({ name, membership }) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-6 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-3">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
          <p className="text-sm opacity-90">
            {membership} • Your investment journey continues
          </p>
        </div>
      </div>
    </div>
  );
};
