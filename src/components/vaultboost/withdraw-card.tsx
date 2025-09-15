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

export function WithdrawCard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [showInvestmentNeededDialog, setShowInvestmentNeededDialog] = useState(false);
  const { userData, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  

  const handleRequestWithdrawal = () => {
    // In prototype mode, just show the form
    setShowWithdrawForm(true);
  };

  const hasInvested = userData?.hasInvested || false;
  const balance = userData?.totalBalance || 0;

  const handleSubmit = async () => {
    setIsLoading(true);
    toast({
        title: 'Prototype Mode',
        description: 'Withdrawal requests are not functional without a backend.',
    });
    setTimeout(() => {
        setIsLoading(false);
        setShowWithdrawForm(false);
    }, 1000);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
          <CardDescription>Available Balance: {balance.toFixed(2)} Rs.</CardDescription>
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
                      Minimum withdrawal is 100 Rs. This is a prototype and no real transaction will be made.
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
    </>
  );
}
