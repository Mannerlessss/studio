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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

type WithdrawalSortableKeys = 'userName' | 'amount' | 'method' | 'date' | 'status';

interface WithdrawalRequest {
  id: string;
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
  date: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
    { id: 'w1', userId: '3', userName: 'Priya Singh', amount: 500, method: 'UPI', details: { upiId: 'priya@okhdfc' }, date: new Date(Date.now() - 3600000), status: 'Pending' },
    { id: 'w2', userId: '1', userName: 'Anjali Sharma', amount: 200, method: 'Bank Transfer', details: { accountHolder: 'Anjali S', accountNumber: '...1234', ifsc: 'HDFC000123' }, date: new Date(Date.now() - 86400000), status: 'Pending' },
    { id: 'w3', userId: '2', userName: 'Rohan Verma', amount: 100, method: 'UPI', details: { upiId: 'rohan.v@okicici' }, date: new Date(Date.now() - 86400000 * 2), status: 'Approved' },
    { id: 'w4', userId: '4', userName: 'Amit Patel', amount: 150, method: 'UPI', details: { upiId: 'patelamit@oksbi' }, date: new Date(Date.now() - 86400000 * 3), status: 'Rejected' },
];

export default function WithdrawalsPage() {
    const { toast } = useToast();
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<WithdrawalSortableKeys>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setWithdrawals(MOCK_WITHDRAWALS);
            setLoading(false);
        }, 500);
    }, []);

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
                let aValue: any, bValue: any;
                if (sortKey === 'date') {
                    aValue = a.date.getTime();
                    bValue = b.date.getTime();
                } else if (sortKey === 'status') {
                    const statusOrder = { 'Pending': 0, 'Approved': 1, 'Rejected': 2 };
                    aValue = statusOrder[a.status];
                    bValue = statusOrder[b.status];
                } else {
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
        toast({
            title: `Request ${newStatus}`,
            description: `Withdrawal request for ${req.userName} has been ${newStatus.toLowerCase()} (simulation).`,
        });
        
        // Simulate update
        setTimeout(() => {
            setWithdrawals(prev => prev.map(w => w.id === req.id ? {...w, status: newStatus} : w));
            setIsSubmitting(null);
        }, 500);
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
                <TableCell>{withdrawal.date?.toLocaleDateString()}</TableCell>
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
