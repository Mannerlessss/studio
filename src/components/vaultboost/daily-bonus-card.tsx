
'use client';
import { FC, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyBonusCardProps {
  onBonusClaim: (amount: number) => void;
}

const prizeAmounts = [1, 2, 3, 4, 5, 6, 7, 8];

// Function to shuffle an array
const shuffle = (array: number[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


export const DailyBonusCard: FC<DailyBonusCardProps> = ({ onBonusClaim }) => {
  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [bonusAvailable, setBonusAvailable] = useState<boolean>(false);
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'picked' | 'revealed'>('ready');
  const [userChoiceIndex, setUserChoiceIndex] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<number[]>([]);

  const wonAmount = useMemo(() => {
    if (userChoiceIndex !== null) {
      return prizes[userChoiceIndex];
    }
    return null;
  }, [userChoiceIndex, prizes]);


  useEffect(() => {
    // The line below is commented out to always show the game for testing.
    const storedLastClaim = localStorage.getItem('lastBonusClaim');
    // const storedLastClaim = null; 
    const storedClaimedAmount = localStorage.getItem('lastClaimedAmount');
    if (storedLastClaim) {
      setLastClaim(Number(storedLastClaim));
      setBonusAvailable(false);
      if(storedClaimedAmount) {
        setClaimedAmount(Number(storedClaimedAmount));
      }
    } else {
      setBonusAvailable(true);
      handleGameReset();
    }
  }, []);

  useEffect(() => {
    if (bonusAvailable) return;

    const interval = setInterval(() => {
      const now = Date.now();
      // lastClaim can be null here if bonusAvailable is false from the start but no lastClaim is in storage
      // This is a race condition on initial load. We should check for lastClaim.
      if (lastClaim === null) {
          clearInterval(interval);
          setBonusAvailable(true); // Should be available if there's no claim time
          return;
      }
        
      const twelveHours = 12 * 60 * 60 * 1000;
      const timeSinceClaim = now - lastClaim;

      if (timeSinceClaim >= twelveHours) {
        setBonusAvailable(true);
        setTimeRemaining('');
        setClaimedAmount(null);
        handleGameReset();
        localStorage.removeItem('lastBonusClaim');
        localStorage.removeItem('lastClaimedAmount');
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
  }, [bonusAvailable, lastClaim]);

  const handleGameReset = () => {
    setPrizes(shuffle([...prizeAmounts]));
    setGameState('ready');
    setUserChoiceIndex(null);
  };
  
  const handleSuitcasePick = (index: number) => {
    if (gameState !== 'ready') return;

    setUserChoiceIndex(index);
    setGameState('picked');

    setTimeout(() => {
      setGameState('revealed');
    }, 2000); // Wait 2 seconds before revealing all
  };

  const handleCollect = () => {
    if (gameState !== 'revealed' || wonAmount === null) return;
    
    onBonusClaim(wonAmount);
    const now = Date.now();
    setLastClaim(now);
    localStorage.setItem('lastBonusClaim', String(now));
    localStorage.setItem('lastClaimedAmount', String(wonAmount));
    
    setClaimedAmount(wonAmount);
    setBonusAvailable(false);
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-accent" />
          <CardTitle className="text-lg font-semibold">Daily Bonus Game</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center flex flex-col items-center justify-center space-y-4 relative">
        {!bonusAvailable ? (
          <>
            {claimedAmount !== null && (
              <p className="text-lg font-semibold text-accent mb-2">
                You won {claimedAmount} Rs!
              </p>
            )}
            <p className="text-muted-foreground">
              Come back in <span className="font-semibold text-primary">{timeRemaining}</span> for your next bonus.
            </p>
          </>
        ) : (
          <>
            {gameState === 'ready' && <p className="text-muted-foreground">Pick a suitcase to reveal your prize!</p>}
            {gameState === 'picked' && <p className="text-muted-foreground animate-pulse">Revealing prizes...</p>}
            {gameState === 'revealed' && <p className="text-muted-foreground">You won {wonAmount} Rs!</p>}

            <div className="grid grid-cols-4 gap-4 w-full">
              {prizes.map((prize, index) => {
                const isPicked = userChoiceIndex === index;
                const isRevealed = gameState === 'revealed';
                
                return (
                  <div key={index} className="perspective-1000">
                    <button
                      onClick={() => handleSuitcasePick(index)}
                      disabled={gameState !== 'ready'}
                      className={cn(
                        "w-full aspect-square preserve-3d transition-transform duration-1000",
                        isRevealed ? 'rotate-y-180' : ''
                      )}
                    >
                      {/* Front of suitcase */}
                      <div className={cn(
                        "absolute w-full h-full backface-hidden rounded-lg border-2 border-amber-700 bg-amber-500 flex items-center justify-center cursor-pointer",
                        "hover:animate-shake disabled:cursor-not-allowed disabled:hover:animate-none",
                         isPicked && !isRevealed ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
                      )}>
                        <Briefcase className="w-8 h-8 text-amber-900" />
                      </div>
                      {/* Back of suitcase (prize) */}
                      <div className={cn(
                        "absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center rotate-y-180",
                         isPicked ? "bg-primary text-primary-foreground border-2 border-primary" : "bg-muted text-muted-foreground border"
                      )}>
                        <span className="text-2xl font-bold">{prize}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            
            {gameState === 'revealed' && (
              <Button onClick={handleCollect} size="lg" className="animate-bounce mt-6">
                Collect {wonAmount} Rs.
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
