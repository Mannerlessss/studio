
'use client';
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
import { DollarSign, Crown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const mockUsers = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    membership: 'Basic',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    membership: 'Pro',
  },
  {
    id: 'USR-003',
    name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    membership: 'Basic',
  },
];

export default function UsersPage() {
    const { toast } = useToast();

    const handleCredit = (userId: string) => {
        toast({
            title: `Investment Credited`,
            description: `Investment has been credited for user ${userId}.`,
        });
    }

    const handleUpgrade = (userId: string) => {
        toast({
            title: `Upgraded to Pro`,
            description: `User ${userId} has been upgraded to the Pro plan.`,
        });
    }

  return (
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
            {mockUsers.map((user) => (
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
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm">
                                <DollarSign className='w-4 h-4 mr-1' /> Credit Investment
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Credit Investment for {user.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the amount to credit. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="credit-amount">Amount (in Rs.)</Label>
                                <Input id="credit-amount" type="number" placeholder="e.g., 1000" />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCredit(user.id)}>
                                Confirm Credit
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {user.membership !== 'Pro' && (
                            <Button size="sm" onClick={() => handleUpgrade(user.id)}>
                                <Crown className='w-4 h-4 mr-1' /> Upgrade to Pro
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
  );
}
