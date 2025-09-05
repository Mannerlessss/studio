
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
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

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

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(userList);
        };

        fetchUsers();
    }, []);

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

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            totalBalance: increment(amount),
            investmentEarnings: increment(amount),
        });

        toast({
            title: `Investment Credited`,
            description: `${amount} Rs. has been credited for user ${userId}.`,
        });

        // Refetch users to show updated data
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(userList);
        setCreditAmount('');
    }

    const handleUpgrade = async (userId: string) => {
         const userRef = doc(db, 'users', userId);
         await updateDoc(userRef, {
            membership: 'Pro',
         });
        toast({
            title: `Upgraded to Pro`,
            description: `User ${userId} has been upgraded to the Pro plan.`,
        });
        // Refetch users
         const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(userList);
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
