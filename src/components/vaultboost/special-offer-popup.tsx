'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export function SpecialOfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();
  const userName = userData?.name || 'User';
  
  const POPUP_STORAGE_KEY = 'vaultboost-special-offer-10k-seen';

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasSeenPopup) {
      setIsOpen(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }
  }, []);

  const message = `Hi, I'm ${userName} and I want to buy the special 10,000 Rs. plan.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-gradient-to-br from-card via-card to-primary/10 border-primary shadow-2xl" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader className="items-center text-center">
          <div className="p-3 bg-primary/20 rounded-full inline-block animate-pulse">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-primary tracking-tight mt-2">
            LIMITED TIME MEGA OFFER!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Valid for the next 4 days only!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
            <p className="text-lg text-muted-foreground">Invest</p>
            <p className="text-7xl font-extrabold text-foreground my-2">10,000<span className="text-4xl ml-1">Rs.</span></p>
            <p className="text-lg text-muted-foreground">Get <span className="font-bold text-green-500">5,000 Rs. Daily</span> for 4 Days!</p>
            <p className="text-2xl font-bold text-foreground mt-4">Total Profit: <span className="text-green-500">20,000 Rs.</span></p>
        </div>
        <DialogFooter className="sm:justify-center flex-col sm:flex-col sm:space-x-0 gap-2">
          <Link href={whatsappUrl} className="w-full" target="_blank" onClick={() => setIsOpen(false)}>
            <Button className="w-full" size="lg">
              <Zap className="mr-2" /> Buy Now
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Maybe Later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
