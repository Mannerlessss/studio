
'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { CheckCircle, XCircle, Loader2, Search, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, writeBatch, getDoc, collectionGroup, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

type WithdrawalSortableKeys = 'userName' | 'amount' | 'method' | 'date' | 'status';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<WithdrawalSortableKeys>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


    useEffect(() => {
        const fetchWithdrawals = async () => {
            setLoading(true);
            try {
                const withdrawalsQuery = query(collectionGroup(db, 'withdrawals'));
                const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
                const requests: WithdrawalRequest[] = [];
                 withdrawalsSnapshot.forEach(doc => {
                    requests.push({ 
                        id: doc.id,
                        userId: doc.ref.parent.parent!.id,
                        ...doc.data()
                    } as WithdrawalRequest);
                });
                
                setWithdrawals(requests);
            } catch (error: any) {
                console.error("Error fetching withdrawals: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch withdrawal requests. Check permissions.' });
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, [toast]);

    const handleSort = (key: WithdrawalSortableKeys) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedWithdrawals = useMemo(() => {
        return withdrawals
            .filter(w => w.userName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                let aValue, bValue;
                if (sortKey === 'date') {
                    aValue = a.date?.toMillis() || 0;
                    bValue = b.date?.toMillis() || 0;
                } else if (sortKey === 'status') {
                     // Custom sort for status: Pending > Approved > Rejected
                    const statusOrder = { 'Pending': 0, 'Approved': 1, 'Rejected': 2 };
                    aValue = statusOrder[a.status];
                    bValue = statusOrder[b.status];
                } 
                else {
                    aValue = a[sortKey];
                    bValue = b[sortKey];
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [withdrawals, searchTerm, sortKey, sortDirection]);

    const handleStatusChange = async (req: WithdrawalRequest, newStatus: 'Approved' | 'Rejected') => {
        setIsSubmitting(req.id);
        const withdrawalDocRef = doc(db, `users/${req.userId}/withdrawals`, req.id);
        
        try {
            const batch = writeBatch(db);

            batch.update(withdrawalDocRef, { status: newStatus });
            
            // Also update the corresponding transaction document
            const transactionQuery = query(
                collection(db, `users/${req.userId}/transactions`), 
                where('type', '==', 'withdrawal'),
                where('amount', '==', req.amount),
                where('status', '==', 'Pending')
            );
            const transactionSnapshot = await getDocs(transactionQuery);
            // This assumes the latest pending withdrawal transaction matches. A more robust system might use a shared ID.
             if (!transactionSnapshot.empty) {
                const transactionDocRef = transactionSnapshot.docs[0].ref;
                batch.update(transactionDocRef, { status: newStatus });
            }


            if (newStatus === 'Rejected') {
                 const userDocRef = doc(db, 'users', req.userId);
                 const userDoc = await getDoc(userDocRef);
                 if (userDoc.exists()) {
                    const userData = userDoc.data();
                    batch.update(userDocRef, {
                        totalBalance: (userData.totalBalance || 0) + req.amount
                    });
                 }
            }

            await batch.commit();

            toast({
                title: `Request ${newStatus}`,
                description: `Withdrawal request for ${req.userName} has been ${newStatus.toLowerCase()}.`,
            });
            
            // Update local state
            setWithdrawals(prev => prev.map(w => w.id === req.id ? {...w, status: newStatus} : w));

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
       <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>
            Approve or reject withdrawal requests from users.
            </CardDescription>
        </div>
         <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search by user name..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('userName')}>
                    User <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('amount')}>
                    Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('date')}>
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead className='text-right min-w-[200px]'>Actions</TableHead>
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
                        <TableCell className="text-right"><Skeleton className="h-8 w-48" /></TableCell>
                    </TableRow>
                ))
            ) : filteredAndSortedWithdrawals.map((withdrawal) => (
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
                <TableCell>{withdrawal.date?.toDate().toLocaleDateString()}</TableCell>
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
             {!loading && filteredAndSortedWithdrawals.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No withdrawal requests found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
