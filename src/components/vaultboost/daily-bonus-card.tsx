'use client';
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Zap } from 'lucide-react';

interface DailyBonusCardProps {
  onBonusClaim: (amount: number) => void;
}

export const DailyBonusCard: FC<DailyBonusCardProps> = ({ onBonusClaim }) => {
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [bonusAvailable, setBonusAvailable] = useState<boolean>(false);
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

  useEffect(() => {
    const storedLastClaim = localStorage.getItem('lastBonusClaim');
    if (storedLastClaim) {
      setLastClaim(Number(storedLastClaim));
    } else {
      setBonusAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (lastClaim === null) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;
      const timeSinceClaim = now - lastClaim;

      if (timeSinceClaim >= twelveHours) {
        setBonusAvailable(true);
        setTimeRemaining('');
        setClaimedAmount(null);
        clearInterval(interval);
      } else {
        setBonusAvailable(false);
        const remaining = twelveHours - timeSinceClaim;
        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastClaim]);

  const handleClaim = () => {
    const amount = Math.floor(Math.random() * 8) + 1;
    onBonusClaim(amount);
    const now = Date.now();
    setLastClaim(now);
    localStorage.setItem('lastBonusClaim', String(now));
    setBonusAvailable(false);
    setClaimedAmount(amount);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-accent" />
          <CardTitle className="text-lg font-semibold">Daily Bonus Game</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        {bonusAvailable ? (
          <>
            <p className="text-muted-foreground mb-4">
              Click the button to claim your daily bonus!
            </p>
            <Button onClick={handleClaim}>
              <Zap className="mr-2 h-4 w-4" /> Claim Now
            </Button>
          </>
        ) : (
          <>
            {claimedAmount !== null && (
              <p className="text-lg font-semibold text-accent mb-2">
                You won {claimedAmount} Rs!
              </p>
            )}
            <p className="text-muted-foreground">
              Come back in <span className="font-semibold text-primary">{timeRemaining}</span> for another bonus.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
