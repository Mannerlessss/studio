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
       <div className="flex-grow">
        <div className='flex justify-between items-start'>
            <div className="text-xl font-bold">{title}</div>
            <span className="bg-black/30 px-3 py-1 text-xs rounded-full">
                {badge}
            </span>
        </div>

        <div className="mt-4 space-y-2 text-sm">
            {monthly && (
                <div className="flex justify-between">
                    <span className="opacity-80">Monthly</span>
                    <b>{monthly.toLocaleString('en-IN')} Rs.</b>
                </div>
            )}
            <div className="flex justify-between">
                <span className="opacity-80">Each Price</span>
                <b>{price.toLocaleString('en-IN')} Rs.</b>
            </div>
             <div className="flex justify-between">
                <span className="opacity-80">Revenue Days</span>
                <b>{days} Days</b>
            </div>
            {daily && (
                 <div className="flex justify-between">
                    <span className="opacity-80">Daily Earnings</span>
                    <b>{daily.toLocaleString('en-IN')} Rs.</b>
                </div>
            )}
             <div className="flex justify-between text-base mt-2">
                <b className="font-bold">Total Revenue</b>
                <b className="font-bold">{total.toLocaleString('en-IN')} Rs.</b>
            </div>
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
