
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const POPUP_STORAGE_KEY = 'vaultboost-announcement-seen';

  useEffect(() => {
    // Use sessionStorage to show popup once per session
    const hasSeenPopup = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md" onInteractOutside={handleClose}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-primary/10 rounded-full">
                <Gift className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome to VaultBoost!
          </DialogTitle>
          <DialogDescription className="text-center">
            Here are some of our amazing benefits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">200 Rs. Sign-up Bonus:</span> New users get a 200 Rs. bonus automatically on sign up!</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Daily Bonus Game:</span> Play every 4 hours to win a random cash prize.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Refer & Earn Big:</span> Get 75 Rs. for each new investor you refer, plus milestone bonuses up to 2,500 Rs.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Fast Withdrawals:</span> Get your earnings processed quickly and easily.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="https://wa.me/7888540806" target="_blank" className="w-full">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <MessageCircle className="mr-2" /> Join on WhatsApp
            </Button>
          </Link>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
