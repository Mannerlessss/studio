
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
import { collection, doc, getDoc, onSnapshot, updateDoc, writeBatch, serverTimestamp, collectionGroup, query, where, getDocs } from 'firebase/firestore';
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
}

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    useEffect(() => {
        const q = collection(db, 'users');
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersData: User[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() } as User);
            });
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch users.' });
            setLoading(false);
        });

        return () => unsubscribe();
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

            const newInvestedAmount = (user as any).invested + amount;
            
            batch.update(userDocRef, { 
                invested: newInvestedAmount,
            });

            const transactionRef = doc(collection(db, `users/${user.id}/transactions`));
            batch.set(transactionRef, {
                type: 'investment',
                amount,
                description: `Admin Credit: ${amount} Rs.`,
                status: 'Completed',
                date: serverTimestamp(),
            });

            // Check for first investment and referral bonus
            if (!user.hasInvested && amount >= 100 && user.referredBy) {
                const bonusAmount = 75;
                const referrerDocRef = doc(db, 'users', user.referredBy);
                const referrerDoc = await getDoc(referrerDocRef);

                if (referrerDoc.exists()) {
                    const referrerData = referrerDoc.data();
                    // Award bonus to the new user
                    batch.update(userDocRef, {
                        totalBalance: (user.totalBalance || 0) + bonusAmount,
                        bonusEarnings: (user.bonusEarnings || 0) + bonusAmount,
                        earnings: ((user as any).earnings || 0) + bonusAmount,
                        hasInvested: true
                    });
                    const userBonusTransactionRef = doc(collection(db, `users/${user.id}/transactions`));
                    batch.set(userBonusTransactionRef, {
                        type: 'bonus',
                        amount: bonusAmount,
                        description: `Welcome referral bonus!`,
                        status: 'Completed',
                        date: serverTimestamp(),
                    });
                    
                    // Award bonus to the referrer
                    batch.update(referrerDocRef, {
                        totalBalance: (referrerData.totalBalance || 0) + bonusAmount,
                        referralEarnings: (referrerData.referralEarnings || 0) + bonusAmount,
                        earnings: (referrerData.earnings || 0) + bonusAmount,
                    });
                    const referrerBonusTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                     batch.set(referrerBonusTransactionRef, {
                        type: 'bonus',
                        amount: bonusAmount,
                        description: `Referral bonus from ${user.name}`,
                        status: 'Completed',
                        date: serverTimestamp(),
                    });

                    // Update the `hasInvested` flag in the referrer's subcollection
                    const referrerReferralsRef = collection(db, 'users', user.referredBy, 'referrals');
                    const q = query(referrerReferralsRef, where("userId", "==", user.id));
                    const referredUserDocs = await getDocs(q);
                    if (!referredUserDocs.empty) {
                        const referredUserDocRef = referredUserDocs.docs[0].ref;
                        batch.update(referredUserDocRef, { hasInvested: true });
                    }
                }
            }
            
            // Mark user as hasInvested even if no referral
             if (!user.hasInvested && amount >= 100) {
                  batch.update(userDocRef, { hasInvested: true });
             }


            await batch.commit();

            toast({
                title: `Investment Credited`,
                description: `${amount} Rs. has been credited for user ${user.name}.`,
            });
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
                 Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
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
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className='w-4 h-4' />
                            <span className="sr-only">View Details</span>
                        </Button>
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
                                Enter the amount to credit. This will trigger referral bonuses on first investment.
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
