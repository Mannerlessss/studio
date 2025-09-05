
'use client';
import { useState, useEffect } from 'react';
import {
    AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Crown, Eye, Wallet, Gift, Users, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface User {
    id: string;
    name: string;
    email: string;
    membership: 'Basic' | 'Pro';
    totalBalance: number;
    bonusEarnings: number;
    referralEarnings: number;
    investmentEarnings: number;
}

const mockUsers: User[] = [
    { id: 'usr-001', name: 'John Doe', email: 'john@example.com', membership: 'Pro', totalBalance: 5500, investmentEarnings: 4000, referralEarnings: 1200, bonusEarnings: 300 },
    { id: 'usr-002', name: 'Jane Smith', email: 'jane@example.com', membership: 'Basic', totalBalance: 1200, investmentEarnings: 1000, referralEarnings: 150, bonusEarnings: 50 },
    { id: 'usr-003', name: 'Sam Wilson', email: 'sam@example.com', membership: 'Basic', totalBalance: 800, investmentEarnings: 800, referralEarnings: 0, bonusEarnings: 0 },
];


export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState('');

    const handleCredit = async (userId: string) => {
        const amount = Number(creditAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid amount to credit.',
            });
            return;
        }

        setUsers(users.map(u => 
            u.id === userId 
            ? { ...u, totalBalance: u.totalBalance + amount, investmentEarnings: u.investmentEarnings + amount }
            : u
        ));

        toast({
            title: `Investment Credited (Mock)`,
            description: `${amount} Rs. has been credited for user ${userId}.`,
        });
        
        setCreditAmount('');
    }

    const handleUpgrade = async (userId: string) => {
         setUsers(users.map(u => 
            u.id === userId 
            ? { ...u, membership: 'Pro' }
            : u
        ));
        toast({
            title: `Upgraded to Pro (Mock)`,
            description: `User ${userId} has been upgraded to the Pro plan.`,
        });
    }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage users and credit their investments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.membership === 'Pro' ? 'default' : 'secondary'}>
                    {user.membership}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className='flex gap-2 justify-end'>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className='w-4 h-4' />
                            <span className="sr-only">View Details</span>
                        </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm">
                                <DollarSign className='w-4 h-4 mr-1' /> Credit
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Credit Investment for {user.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the amount to credit. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="credit-amount">Amount (in Rs.)</Label>
                                <Input id="credit-amount" type="number" placeholder="e.g., 1000" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCredit(user.id)}>
                                Confirm Credit
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {user.membership !== 'Pro' && (
                            <Button size="sm" onClick={() => handleUpgrade(user.id)}>
                                <Crown className='w-4 h-4 mr-1' /> Upgrade
                            </Button>
                        )}
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>User Details: {selectedUser.name}</DialogTitle>
                    <DialogDescription>
                        Financial overview for {selectedUser.email}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Total Balance</span>
                        </div>
                        <span className="font-bold text-lg">{selectedUser.totalBalance} Rs.</span>
                    </div>
                    <div className="space-y-2 text-sm">
                       <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="w-4 h-4" />
                                <span>Investment Earnings</span>
                            </div>
                            <span>{selectedUser.investmentEarnings} Rs.</span>
                       </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>Referral Earnings</span>
                            </div>
                            <span>{selectedUser.referralEarnings} Rs.</span>
                       </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Gift className="w-4 h-4" />
                                <span>Bonus Earnings</span>
                            </div>
                            <span>{selectedUser.bonusEarnings} Rs.</span>
                       </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}
