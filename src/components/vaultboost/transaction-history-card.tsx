
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, TrendingUp, Banknote, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockTransactions = [
    {
        id: 1,
        type: 'bonus',
        description: 'Daily Bonus Claim',
        date: '2024-09-05 10:30',
        amount: 5,
        status: 'Completed'
    },
    {
        id: 2,
        type: 'investment',
        description: 'Invested in Plan 300',
        date: '2024-09-04 15:00',
        amount: -300,
        status: 'Completed'
    },
    {
        id: 3,
        type: 'earning',
        description: 'Daily Earning from Plan 300',
        date: '2024-09-05 08:00',
        amount: 30,
        status: 'Completed'
    },
     {
        id: 4,
        type: 'withdrawal',
        description: 'Withdrawal Request',
        date: '2024-09-03 11:00',
        amount: -1200,
        status: 'Pending'
    },
];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent financial activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockTransactions.map((transaction) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
