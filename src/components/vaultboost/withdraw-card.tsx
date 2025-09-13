
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, ShieldCheck, Info, DollarSign, Loader2 } from 'lucide-react';
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
import { addDoc, collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function WithdrawCard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [showInvestmentNeededDialog, setShowInvestmentNeededDialog] = useState(false);
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  

  const handleRequestWithdrawal = () => {
    // This check is a bit redundant now but good for UX
    if (!userData?.hasInvested) {
        setShowInvestmentNeededDialog(true);
        return;
    }
    setShowWithdrawForm(true);
  };

  const hasInvested = userData?.hasInvested || false;
  const canWithdraw = (userData?.totalBalance || 0) >= 100;
  const balance = userData?.totalBalance || 0;

  const handleSubmit = async () => {
     if (!user || !userData) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not found.' });
      return;
    }
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

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Minimum withdrawal amount is 100 Rs.' });
        return;
    }
     if (withdrawAmount > balance) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Withdrawal amount cannot exceed your available balance.' });
        return;
    }

    let details: any = {};
    if (method === 'upi') {
        if (!upiId) {
            toast({ variant: 'destructive', title: 'Missing Field', description: 'Please enter your UPI ID.' });
            return;
        }
        details.upiId = upiId;
    } else { // bank
         if (!accountNumber || !ifsc) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please enter all bank details.' });
            return;
        }
        details.accountHolder = userData.name;
        details.accountNumber = accountNumber;
        details.ifsc = ifsc;
    }
    
    setIsLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error("User document does not exist.");
        }

        const currentBalance = userDoc.data().totalBalance || 0;
        if (currentBalance < withdrawAmount) {
          throw new Error("Insufficient funds.");
        }

        // 1. Deduct from user's balance
        transaction.update(userDocRef, {
          totalBalance: currentBalance - withdrawAmount,
        });

        // 2. Create withdrawal request
        const withdrawalRef = doc(collection(db, `users/${user.uid}/withdrawals`));
        transaction.set(withdrawalRef, {
          amount: withdrawAmount,
          method: method === 'upi' ? 'UPI' : 'Bank Transfer',
          details,
          status: 'Pending',
          date: serverTimestamp(),
          userName: userData.name,
        });

         // 3. Create a transaction record
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        transaction.set(transactionRef, {
            type: 'withdrawal',
            amount: withdrawAmount,
            description: `Withdrawal request`,
            status: 'Pending',
            date: serverTimestamp(),
        });
      });

      toast({
        title: 'Request Submitted',
        description: 'Your withdrawal request has been submitted for processing.',
      });
      // Reset form
      setShowWithdrawForm(false);
      setAmount('');
      setUpiId('');
      setAccountNumber('');
      setIfsc('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Withdrawal Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
                      Minimum withdrawal is 100 Rs. Your request will be processed within 24-48 hours.
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
               <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Withdraw</Label>
                  <Input id="amount" type="number" placeholder="e.g., 150" value={amount} onChange={e => setAmount(e.target.value)} disabled={isLoading}/>
                </div>
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
                  <Input id="upi-id" placeholder="yourname@bank" value={upiId} onChange={e => setUpiId(e.target.value)} disabled={isLoading} />
                </div>
              )}

              {method === 'bank' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-holder">Account Holder Name</Label>
                    <Input id="account-holder" value={userData?.name} disabled readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="1234567890" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input id="ifsc-code" placeholder="BANK0001234" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} disabled={isLoading}/>
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
