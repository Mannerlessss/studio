
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, ShieldCheck, Info, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

export function WithdrawCard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [showInvestmentNeededDialog, setShowInvestmentNeededDialog] = useState(false);
  const { userData } = useAuth();
  const { toast } = useToast();

  const handleRequestWithdrawal = () => {
    setShowWithdrawForm(true);
  };

  const hasInvested = (userData?.invested || 0) > 0;
  const canWithdraw = (userData?.totalBalance || 0) >= 100;

  const handleSubmit = () => {
    if (!hasInvested) {
      setShowInvestmentNeededDialog(true);
      return;
    }

    if (!canWithdraw) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: 'You need at least 100 Rs. in your balance to make a withdrawal.',
      });
      return;
    }

    // Placeholder for actual submission logic
    toast({
      title: 'Request Submitted',
      description: 'Your withdrawal request has been submitted for processing.',
    });
    setShowWithdrawForm(false);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
          <CardDescription>Available Balance: {userData?.totalBalance.toFixed(2) || '0.00'} Rs.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showWithdrawForm ? (
            <div className='space-y-4'>
              <Button className="w-full" onClick={handleRequestWithdrawal}>
                  <Banknote className="mr-2" /> Request Withdrawal
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
               <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                      Minimum withdrawal is 100 Rs. Withdrawal will be transferred within 24 to 48 hours.
                  </AlertDescription>
              </Alert>
               {userData?.name && (
                  <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400">
                      <ShieldCheck className="h-4 w-4 !text-green-500" />
                      <AlertTitle>Security Notice</AlertTitle>
                      <AlertDescription>
                          For your safety, withdrawals will only be processed to an account with the name: <span className='font-bold'>{userData.name}</span>.
                      </AlertDescription>
                  </Alert>
              )}
              <RadioGroup value={method} onValueChange={(value: 'upi' | 'bank') => setMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
              </RadioGroup>

              {method === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="yourname@bank" />
                </div>
              )}

              {method === 'bank' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-holder">Account Holder Name</Label>
                    <Input id="account-holder" placeholder={userData?.name} defaultValue={userData?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="1234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input id="ifsc-code" placeholder="BANK0001234" />
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={handleSubmit}>
                Submit Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showInvestmentNeededDialog} onOpenChange={setShowInvestmentNeededDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <div className="flex justify-center mb-4">
               <div className="p-3 bg-primary/10 rounded-full">
                  <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Investment Required</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              To ensure the security and sustainability of our platform, withdrawals are enabled only after you make your first investment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Link href="/investment" className='w-full'>
                <Button className='w-full'>
                    Make an Investment
                </Button>
            </Link>
            <AlertDialogAction onClick={() => setShowInvestmentNeededDialog(false)} variant="outline">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
