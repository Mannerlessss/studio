'use client';
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyBonusCardProps {
  onBonusClaim: (amount: number) => void;
}

const prizes = [1, 5, 3, 7, 2, 8, 4, 6];
const wheelColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

export const DailyBonusCard: FC<DailyBonusCardProps> = ({ onBonusClaim }) => {
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [bonusAvailable, setBonusAvailable] = useState<boolean>(false);
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(0);

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

  const handleSpin = () => {
    if (!bonusAvailable || isSpinning) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prizeAmount = prizes[randomIndex];
    
    // Calculate rotation: 360 * fullSpins + segmentAngle
    const fullSpins = 5;
    const segmentAngle = 360 / prizes.length;
    const prizeAngle = randomIndex * segmentAngle;
    const randomOffset = Math.random() * segmentAngle * 0.8 - (segmentAngle * 0.4); // Add some randomness within the segment
    const totalRotation = (360 * fullSpins) + prizeAngle + randomOffset;

    setSpinResult(totalRotation);

    setTimeout(() => {
      onBonusClaim(prizeAmount);
      const now = Date.now();
      setLastClaim(now);
      localStorage.setItem('lastBonusClaim', String(now));
      setBonusAvailable(false);
      setClaimedAmount(prizeAmount);
      setIsSpinning(false);
    }, 4000); // Corresponds to the animation duration
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-accent" />
          <CardTitle className="text-lg font-semibold">Daily Bonus Game</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center flex flex-col items-center justify-center space-y-4">
        {bonusAvailable ? (
          <>
            <div className="relative w-64 h-64 flex items-center justify-center mb-4">
              {/* Pointer */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
                 <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-white"></div>
              </div>
              
              {/* Wheel */}
              <div
                className="relative w-60 h-60 rounded-full border-4 border-primary/50 shadow-inner overflow-hidden transition-transform duration-[4000ms] ease-out"
                style={{ transform: `rotate(${spinResult}deg)` }}
              >
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className={cn(
                      'absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center',
                      wheelColors[index % wheelColors.length]
                    )}
                    style={{
                      transform: `rotate(${index * (360 / prizes.length)}deg)`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
                    }}
                  >
                    <span
                      className="text-white font-bold text-lg -rotate-45 translate-y-2"
                      style={{ transform: `rotate(${(360/prizes.length)/2 - 90}deg) translate(40px, 0px)` }}
                    >
                      {prize}
                    </span>
                  </div>
                ))}
              </div>
               {/* Center Circle */}
              <div className="absolute w-16 h-16 rounded-full bg-card border-4 border-primary flex items-center justify-center text-primary z-10">
                <Zap className="w-8 h-8" />
              </div>
            </div>

            <p className="text-muted-foreground">
              Click the button to spin the wheel for your daily bonus!
            </p>
            <Button onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? 'Spinning...' : 'Spin Now'}
            </Button>
          </>
        ) : (
          <>
            {claimedAmount !== null ? (
              <p className="text-lg font-semibold text-accent mb-2">
                You won {claimedAmount} Rs!
              </p>
            ) : (
                 <p className="text-muted-foreground mb-2">
                    Bonus claimed for today!
                </p>
            )}
            <p className="text-muted-foreground">
              Come back in <span className="font-semibold text-primary">{timeRemaining}</span> for another spin.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};