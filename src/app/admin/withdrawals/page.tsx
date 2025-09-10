
'use client';
import { useState, useEffect } from 'react';
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
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collectionGroup, doc, getDocs, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface WithdrawalRequest {
  id: string; // Document ID of the withdrawal request
  userId: string;
  userName: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer';
  details: { 
    upiId?: string;
    accountHolder?: string;
    accountNumber?: string;
    ifsc?: string;
  };
  date: any; // Firestore timestamp
  status: 'Pending' | 'Approved' | 'Rejected';
}


export default function WithdrawalsPage() {
    const { toast } = useToast();
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // Store ID of item being submitted

    useEffect(() => {
        const withdrawalsRef = collectionGroup(db, 'withdrawals');
        const unsubscribe = onSnapshot(withdrawalsRef, (snapshot) => {
            const requests: WithdrawalRequest[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                requests.push({ 
                    id: doc.id,
                    userId: doc.ref.parent.parent!.id,
                    ...data
                 } as WithdrawalRequest);
            });
            // Sort by date descending, pending first
            requests.sort((a, b) => {
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                return b.date.toMillis() - a.date.toMillis();
            });
            setWithdrawals(requests);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching withdrawals: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch withdrawal requests.' });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleStatusChange = async (req: WithdrawalRequest, newStatus: 'Approved' | 'Rejected') => {
        setIsSubmitting(req.id);
        const withdrawalDocRef = doc(db, `users/${req.userId}/withdrawals`, req.id);
        const userDocRef = doc(db, 'users', req.userId);

        try {
            const batch = writeBatch(db);

            batch.update(withdrawalDocRef, { status: newStatus });
            
            // If rejected, refund the amount to the user's balance
            if (newStatus === 'Rejected') {
                 const userDoc = await getDocs(collection(db, 'users'));
                 const userData = userDoc.docs.find(d => d.id === req.userId)?.data();
                 if (userData) {
                    batch.update(userDocRef, {
                        totalBalance: userData.totalBalance + req.amount
                    });
                 }
            }

            await batch.commit();

            toast({
                title: `Request ${newStatus}`,
                description: `Withdrawal request for ${req.userName} has been ${newStatus.toLowerCase()}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsSubmitting(null);
        }
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Requests</CardTitle>
        <CardDescription>
          Approve or reject withdrawal requests from users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
                 Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))
            ) : withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                <TableCell>{withdrawal.amount} Rs.</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell className='font-mono text-xs'>
                   {withdrawal.method === 'UPI' ? (
                        <span>{withdrawal.details.upiId}</span>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <span>{withdrawal.details.accountHolder}</span>
                            <span>{withdrawal.details.accountNumber}</span>
                            <span>{withdrawal.details.ifsc}</span>
                        </div>
                    )}
                </TableCell>
                <TableCell>{withdrawal.date.toDate().toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      withdrawal.status === 'Pending'
                        ? 'secondary'
                        : withdrawal.status === 'Approved'
                        ? 'default'
                        : 'destructive'
                    }
                     className={withdrawal.status === 'Approved' ? 'bg-green-500/80' : ''}
                  >
                    {withdrawal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {withdrawal.status === 'Pending' && (
                        <div className='flex gap-2 justify-end'>
                            <Button variant="outline" size="sm" onClick={() => handleStatusChange(withdrawal, 'Approved')} disabled={!!isSubmitting}>
                                {isSubmitting === withdrawal.id ? <Loader2 className='w-4 h-4 mr-1 animate-spin'/> : <CheckCircle className='w-4 h-4 mr-1' />} 
                                Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleStatusChange(withdrawal, 'Rejected')} disabled={!!isSubmitting}>
                                {isSubmitting === withdrawal.id ? <Loader2 className='w-4 h-4 mr-1 animate-spin'/> : <XCircle className='w-4 h-4 mr-1' />}
                                Reject
                            </Button>
                        </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && withdrawals.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No withdrawal requests found.</p>
        )}
      </CardContent>
    </Card>
  );
}
