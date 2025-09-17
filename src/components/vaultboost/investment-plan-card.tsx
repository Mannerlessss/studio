'use client';
import { FC } from 'react';
import Link from 'next/link';

interface InvestmentPlanCardProps {
  title: string;
  price: number;
  days: number;
  daily?: number;
  total: number;
  color: string;
  badge: string;
  userName?: string;
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
}) => {
    const message = `Hi, I'm ${userName} and I want to buy the ${title} plan for ${price} Rs.`;
    const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;
  return (
    <div
      className={`rounded-2xl shadow-xl p-6 text-white bg-gradient-to-br ${color} relative transform hover:scale-105 transition duration-300`}
    >
      <span className="absolute top-3 right-3 bg-black/30 px-3 py-1 text-xs rounded-full">
        {badge}
      </span>

      <div className="text-2xl font-bold mb-2">{title}</div>
      <div className="space-y-2 text-sm">
        <p>💎 Each Price: <b>{price.toLocaleString('en-IN')} Rs.</b></p>
        <p>📅 Revenue: <b>{days} Days</b></p>
        {daily && <p>💰 Daily Earnings: <b>{daily.toLocaleString('en-IN')} Rs.</b></p>}
        <p>🏆 Total Revenue: <b>{total.toLocaleString('en-IN')} Rs.</b></p>
      </div>

       <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <button className="mt-4 w-full py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
            Buy Now
          </button>
      </Link>
    </div>
  );
};
