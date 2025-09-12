
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function WithdrawCard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const { userData } = useAuth();

  const handleRequestWithdrawal = () => {
    setShowWithdrawForm(true);
  };

  const hasInvested = (userData?.invested || 0) > 0;

  return (
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
            <Button className="w-full" disabled={!hasInvested || (userData?.totalBalance || 0) < 100}>
              {!hasInvested ? 'First Investment Required' : 'Submit Request'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
