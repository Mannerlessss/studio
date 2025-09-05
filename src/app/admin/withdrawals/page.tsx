'use client';
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
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockWithdrawals = [
  {
    id: 'WDR-001',
    userName: 'John Doe',
    amount: 1500,
    method: 'UPI',
    details: 'john.doe@upi',
    date: '2024-09-05',
    status: 'Pending',
  },
  {
    id: 'WDR-002',
    userName: 'Jane Smith',
    amount: 2500,
    method: 'Bank Transfer',
    details: 'XXXXXXXX1234',
    date: '2024-09-04',
    status: 'Pending',
  },
    {
    id: 'WDR-003',
    userName: 'Sam Wilson',
    amount: 1000,
    method: 'UPI',
    details: 'sam.wilson@upi',
    date: '2024-09-03',
    status: 'Approved',
  },
    {
    id: 'WDR-004',
    userName: 'Lisa Ray',
    amount: 5000,
    method: 'Bank Transfer',
    details: 'XXXXXXXX5678',
    date: '2024-09-02',
    status: 'Rejected',
  },
];

export default function WithdrawalsPage() {
    const { toast } = useToast();

    const handleApprove = (id: string) => {
        toast({
            title: 'Request Approved',
            description: `Withdrawal request ${id} has been approved.`,
        });
    }

    const handleReject = (id: string) => {
        toast({
            variant: 'destructive',
            title: 'Request Rejected',
            description: `Withdrawal request ${id} has been rejected.`,
        });
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
            {mockWithdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                <TableCell>{withdrawal.amount} Rs.</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell className='font-mono text-xs'>{withdrawal.details}</TableCell>
                <TableCell>{withdrawal.date}</TableCell>
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
                            <Button variant="outline" size="sm" onClick={() => handleApprove(withdrawal.id)}>
                                <CheckCircle className='w-4 h-4 mr-1' /> Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(withdrawal.id)}>
                                <XCircle className='w-4 h-4 mr-1' /> Reject
                            </Button>
                        </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
