'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, TrendingUp, Banknote, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type TransactionType = 'bonus' | 'investment' | 'earning' | 'withdrawal';

const mockTransactions: any[] = [];

const getTransactionIcon = (type: string) => {
    switch(type) {
        case 'bonus':
            return <Gift className="h-5 w-5 text-muted-foreground" />;
        case 'investment':
            return <TrendingUp className="h-5 w-5 text-muted-foreground" />;
        case 'earning':
            return <ArrowUpCircle className="h-5 w-5 text-muted-foreground" />;
        case 'withdrawal':
            return <ArrowDownCircle className="h-5 w-5 text-muted-foreground" />;
        default:
            return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'default';
        case 'Pending':
            return 'secondary';
        case 'Rejected':
            return 'destructive';
        default:
            return 'outline';
    }
}


export function TransactionHistoryCard() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filteredTransactions = mockTransactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const filters: ('all' | TransactionType)[] = ['all', 'earning', 'bonus', 'withdrawal'];

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
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-full">
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className={cn("font-bold", transaction.amount > 0 ? 'text-green-500' : 'text-red-500')}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} Rs.
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
