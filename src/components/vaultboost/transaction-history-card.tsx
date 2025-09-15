'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, TrendingUp, Users, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type TransactionType = 'bonus' | 'investment' | 'earning' | 'withdrawal' | 'referral';

interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    status: 'Completed' | 'Pending' | 'Rejected';
    date: Date;
}

// Mock Data since backend is removed
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'earning', amount: 50, description: 'Earning from Plan 500', status: 'Completed', date: new Date() },
    { id: '2', type: 'referral', amount: 75, description: 'Referral bonus from Friend', status: 'Completed', date: new Date(Date.now() - 3600000 * 2) },
    { id: '3', type: 'withdrawal', amount: 200, description: 'Withdrawal request', status: 'Pending', date: new Date(Date.now() - 3600000 * 5) },
    { id: '4', type: 'investment', amount: 500, description: 'Invested in Plan 500', status: 'Completed', date: new Date(Date.now() - 3600000 * 10) },
    { id: '5', type: 'bonus', amount: 5, description: 'Daily Bonus Claim', status: 'Completed', date: new Date(Date.now() - 3600000 * 12) },
];


const getTransactionIcon = (type: string) => {
    switch(type) {
        case 'bonus': return <Gift className="h-5 w-5 text-muted-foreground" />;
        case 'investment': return <TrendingUp className="h-5 w-5 text-muted-foreground" />;
        case 'earning': return <ArrowUpCircle className="h-5 w-5 text-muted-foreground" />;
        case 'withdrawal': return <ArrowDownCircle className="h-5 w-5 text-muted-foreground" />;
        case 'referral': return <Users className="h-5 w-5 text-muted-foreground" />;
        default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Pending': return 'secondary';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
}


export function TransactionHistoryCard() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
        setTransactions(MOCK_TRANSACTIONS);
        setLoading(false);
    }, 500);
  }, []);


  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const filters: ('all' | TransactionType)[] = ['all', 'investment', 'earning', 'bonus', 'referral', 'withdrawal'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent financial activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
                 <Button 
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="capitalize"
                 >
                    {f}
                 </Button>
            ))}
        </div>
        <div className="space-y-2">
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-full">
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(transaction.date)}
                                </p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className={cn("font-bold", transaction.type === 'withdrawal' ? 'text-red-500' : 'text-green-500')}>
                                {transaction.type === 'withdrawal' ? '-' : '+'}{transaction.amount.toFixed(2)} Rs.
                            </p>
                            <Badge variant={getStatusBadgeVariant(transaction.status)} 
                                className={cn({
                                    'bg-green-500/80': transaction.status === 'Completed',
                                    'bg-yellow-500/80': transaction.status === 'Pending',
                                    'bg-red-500/80': transaction.status === 'Rejected',
                                })}>
                                {transaction.status}
                            </Badge>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="text-center py-8 text-muted-foreground">
                    No transactions of this type.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
