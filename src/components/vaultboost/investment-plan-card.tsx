'use client';
import { FC } from 'react';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestmentPlanCardProps {
  id: string;
  title: string;
  price: number;
  days: number;
  daily?: number;
  total: number;
  color: string;
  badge: string;
  userName?: string;
  monthly?: number;
}

export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  title,
  price,
  days,
  daily,
  total,
  color,
  badge,
  userName = 'User',
  monthly,
}) => {
    const message = `Hi, I'm ${userName} and I want to buy the ${title} plan for ${price} Rs.`;
    const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;
  return (
    <div
      className={`rounded-2xl shadow-xl p-4 text-white bg-gradient-to-br ${color} relative transform hover:scale-105 transition duration-300 flex flex-col`}
    >
       <div className='flex justify-between items-start'>
         <div className="text-xl font-bold mb-2">{title}</div>
        <span className="bg-black/30 px-3 py-1 text-xs rounded-full">
            {badge}
        </span>
       </div>

      <div className="flex-grow flex items-center justify-between mt-2">
        <div className="flex-shrink-0">
          <Gem className="w-16 h-16 text-white/50" />
        </div>
        <div className="space-y-1 text-sm text-right">
            {monthly && <p>📈 Monthly: <b>{monthly.toLocaleString('en-IN')} Rs.</b></p>}
            <p>💎 Each Price: <b>{price.toLocaleString('en-IN')} Rs.</b></p>
            <p>📅 Days: <b>{days} Days</b></p>
            {daily && <p>💰 Daily Earnings: <b>{daily.toLocaleString('en-IN')} Rs.</b></p>}
            <p>🏆 Total Revenue: <b>{total.toLocaleString('en-IN')} Rs.</b></p>
        </div>
      </div>

       <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <button className="mt-4 w-full py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
            Buy Now
          </button>
      </Link>
    </div>
  );
};
