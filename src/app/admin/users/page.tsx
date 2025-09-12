
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
import { DollarSign, Crown, Eye, Wallet, Gift, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch, serverTimestamp, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
    id: string;
    name: string;
    email: string;
    membership: 'Basic' | 'Pro';
    totalBalance: number;
    bonusEarnings: number;
    referralEarnings: number;
    investmentEarnings: number;
    hasInvested?: boolean;
    referredBy?: string;
    invested?: number;
    projected?: number;
    claimedMilestones?: number[];
}

const referralMilestones: { [key: number]: number } = {
  5: 250,
  10: 500,
  20: 1000,
  30: 1500,
  40: 2000,
  50: 2500,
};

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersData: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersData);
            } catch (error: any) {
                console.error("Error fetching users: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch users. Check permissions.' });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);

    const handleCredit = async (user: User) => {
        setIsSubmitting(user.id);
        const amount = Number(creditAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid amount to credit.',
            });
            setIsSubmitting(null);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.id);
            const batch = writeBatch(db);

            const newInvestedAmount = (user.invested || 0) + amount;
            const dailyReturnRate = user.membership === 'Pro' ? 0.13 : 0.10;
            const newProjectedAmount = newInvestedAmount * dailyReturnRate * 30;
            
            batch.update(userDocRef, { 
                invested: newInvestedAmount,
                projected: newProjectedAmount,
                investmentEarnings: user.hasInvested ? (user.investmentEarnings || 0) : 0, 
                lastInvestmentUpdate: serverTimestamp(),
            });

            const transactionRef = doc(collection(db, `users/${user.id}/transactions`));
            batch.set(transactionRef, {
                type: 'investment',
                amount,
                description: `Investment Added`,
                status: 'Completed',
                date: serverTimestamp(),
            });

            // --- Referral & Milestone Logic ---
            if (!user.hasInvested && amount >= 100 && user.referredBy) {
                const referrerDocRef = doc(db, 'users', user.referredBy);
                const referrerDoc = await getDoc(referrerDocRef);

                if (referrerDoc.exists()) {
                    const referrerData = referrerDoc.data() as User;
                    const bonusAmount = 75; // Standard referral bonus
                    
                    // 1. Give welcome bonus to the new investor
                    batch.update(userDocRef, {
                        totalBalance: (user.totalBalance || 0) + bonusAmount,
                        bonusEarnings: (user.bonusEarnings || 0) + bonusAmount,
                        earnings: ((user as any).earnings || 0) + bonusAmount,
                    });
                    const userBonusTransactionRef = doc(collection(db, `users/${user.id}/transactions`));
                    batch.set(userBonusTransactionRef, {
                        type: 'bonus', amount: bonusAmount, description: `Welcome referral bonus!`, status: 'Completed', date: serverTimestamp(),
                    });

                    // 2. Give standard referral bonus to the referrer
                    batch.update(referrerDocRef, {
                        totalBalance: (referrerData.totalBalance || 0) + bonusAmount,
                        referralEarnings: (referrerData.referralEarnings || 0) + bonusAmount,
                        earnings: (referrerData.earnings || 0) + bonusAmount,
                    });
                    const referrerBonusTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                     batch.set(referrerBonusTransactionRef, {
                        type: 'referral', amount: bonusAmount, description: `Referral bonus from ${user.name}`, status: 'Completed', date: serverTimestamp(),
                    });

                    // 3. Mark the referred user as "invested" in the referrer's subcollection
                    const referrerReferralsRef = collection(db, 'users', user.referredBy, 'referrals');
                    const q = query(referrerReferralsRef, where("userId", "==", user.id));
                    const referredUserDocs = await getDocs(q);
                    if (!referredUserDocs.empty) {
                        const referredUserDocRef = referredUserDocs.docs[0].ref;
                        batch.update(referredUserDocRef, { hasInvested: true });
                    }

                    // 4. Check for referral milestones for the referrer
                    const referralsQuery = query(collection(db, `users/${user.referredBy}/referrals`), where("hasInvested", "==", true));
                    const investedReferralsSnapshot = await getDocs(referralsQuery);
                    const newInvestedCount = investedReferralsSnapshot.size + 1; // +1 for the current user
                    
                    for (const milestone of Object.keys(referralMilestones).map(Number)) {
                        const reward = referralMilestones[milestone];
                        const alreadyClaimed = referrerData.claimedMilestones?.includes(milestone);

                        if (newInvestedCount >= milestone && !alreadyClaimed) {
                            // Add reward to referrer's balance
                            batch.update(referrerDocRef, {
                                totalBalance: (referrerData.totalBalance || 0) + bonusAmount + reward, // Add the standard bonus again since it's deferred until commit
                                referralEarnings: (referrerData.referralEarnings || 0) + bonusAmount + reward,
                                earnings: (referrerData.earnings || 0) + bonusAmount + reward,
                                claimedMilestones: [...(referrerData.claimedMilestones || []), milestone]
                            });

                            // Create transaction for milestone bonus
                            const milestoneTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                            batch.set(milestoneTransactionRef, {
                                type: 'referral', amount: reward, description: `Referral Milestone: ${milestone} users!`, status: 'Completed', date: serverTimestamp(),
                            });
                        }
                    }
                }
            }
            // --- End Referral & Milestone Logic ---
            
             if (!user.hasInvested && amount >= 100) {
                  batch.update(userDocRef, { hasInvested: true });
             }

            await batch.commit();

            toast({
                title: `Investment Credited`,
                description: `${amount} Rs. has been credited for user ${user.name}.`,
            });
            setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, hasInvested: true, invested: newInvestedAmount, projected: newProjectedAmount, investmentEarnings: user.hasInvested ? u.investmentEarnings : 0 } : u));
            setCreditAmount('');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: `Credit Failed`,
                description: error.message,
            });
        } finally {
            setIsSubmitting(null);
        }
    }

    const handleUpgrade = async (userId: string) => {
        setIsSubmitting(userId);
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { membership: 'Pro' });
            toast({
                title: `Upgraded to Pro`,
                description: `User has been upgraded to the Pro plan.`,
            });
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, membership: 'Pro' } : u));
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: `Upgrade Failed`,
                description: error.message,
            });
        } finally {
            setIsSubmitting(null);
        }
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
            {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-48" /></TableCell>
                    </TableRow>
                ))
            ) : users.map((user) => (
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
                        <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                                    <Eye className='w-4 h-4' />
                                    <span className="sr-only">View Details</span>
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                       <AlertDialog onOpenChange={(open) => !open && setCreditAmount('')}>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm" disabled={!!isSubmitting}>
                                <DollarSign className='w-4 h-4 mr-1' /> Credit
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Credit Investment for {user.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the amount to credit. This will trigger referral bonuses and milestones on first investment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="credit-amount">Amount (in Rs.)</Label>
                                <Input id="credit-amount" type="number" placeholder="e.g., 1000" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} disabled={!!isSubmitting}/>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={!!isSubmitting}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCredit(user)} disabled={!!isSubmitting}>
                                {isSubmitting === user.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Credit
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {user.membership !== 'Pro' && (
                            <Button size="sm" onClick={() => handleUpgrade(user.id)} disabled={!!isSubmitting}>
                                {isSubmitting === user.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Crown className='w-4 h-4 mr-1' /> Upgrade
                            </Button>
                        )}
                    </div>
                </TableCell>
              </TableRow>
            ))}
             {!loading && users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
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
                        <span className="font-bold text-lg">{selectedUser.totalBalance || 0} Rs.</span>
                    </div>
                    <div className="space-y-2 text-sm">
                       <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="w-4 h-4" />
                                <span>Investment Earnings</span>
                            </div>
                            <span>{selectedUser.investmentEarnings || 0} Rs.</span>
                       </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>Referral Earnings</span>
                            </div>
                            <span>{selectedUser.referralEarnings || 0} Rs.</span>
                       </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Gift className="w-4 h-4" />
                                <span>Bonus Earnings</span>
                            </div>
                            <span>{selectedUser.bonusEarnings || 0} Rs.</span>
                       </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}
