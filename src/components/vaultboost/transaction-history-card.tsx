import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export function TransactionHistoryCard() {
    const transactions = [
        {
            id: 1,
            description: 'Daily bonus claim - 2 Rs.',
            date: '4 Sept 2025, 10:06 am',
            amount: '+2.00 Rs.',
            status: 'completed'
        }
    ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.map((transaction) => (
             <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-card border mb-2">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className="font-bold text-green-500">{transaction.amount}</p>
                    <Badge variant={transaction.status === 'completed' ? 'secondary' : 'destructive'} 
                           className="bg-blue-500 text-white">
                        {transaction.status}
                    </Badge>
                </div>
             </div>
        ))}
      </CardContent>
    </Card>
  );
}
