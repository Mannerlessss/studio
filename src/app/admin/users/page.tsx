'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { DollarSign, Crown, Eye, Wallet, Gift, Users, TrendingUp, Loader2, Trash2, ArrowUpDown, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { deleteUser } from '@/ai/flows/delete-user-flow';
import { getAllUsers, UserForAdmin } from '@/ai/flows/get-all-users-flow';
import { creditInvestment } from '@/ai/flows/credit-investment-flow';
import { doc, updateDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebaseClient';


type UserSortableKeys = 'name' | 'email' | 'membership';
const investmentPlans = [150, 300, 400, 1000, 1600, 4000, 10000, 25000, 30000, 50000, 60000, 100000];


export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserForAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserForAdmin | null>(null);
    const [creditAmount, setCreditAmount] = useState('150'); // Default to a valid plan
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<UserSortableKeys>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (error: any) {
                console.error("Error fetching users: ", error);
                toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not fetch users from server.' });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);
    
    const filteredAndSortedUsers = useMemo(() => {
        return users
            .filter(user =>
                (user?.name ?? '').toLowerCase().includes((searchTerm ?? '').toLowerCase()) ||
                (user?.email ?? '').toLowerCase().includes((searchTerm ?? '').toLowerCase())
            )
            .sort((a, b) => {
                const aValue = a[sortKey] || '';
                const bValue = b[sortKey] || '';
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [users, searchTerm, sortKey, sortDirection]);

    const handleSort = (key: UserSortableKeys) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        setIsSubmitting(userId);
        try {
            const result = await deleteUser(userId);
            toast({
                title: 'User Deleted',
                description: result.message,
            });
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: error.message,
            });
        } finally {
            setIsSubmitting(null);
        }
    };

    const handleCredit = async (user: UserForAdmin) => {
        setIsSubmitting(user.id);
        const amount = Number(creditAmount);
        if (isNaN(amount) || !investmentPlans.includes(amount)) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please select a valid investment plan amount.',
            });
            setIsSubmitting(null);
            return;
        }

        try {
            const result = await creditInvestment({ userId: user.id, amount });
            
            toast({
                title: `Investment Credited`,
                description: result.message,
            });
            setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { 
                ...u, 
                hasInvested: true, 
                totalInvested: (u.totalInvested || 0) + amount,
            } : u));
            setCreditAmount('150');
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
            const userDocRef = doc(clientDb, 'users', userId);
            await updateDoc(userDocRef, { membership: 'Pro' });
            toast({
                title: `Upgraded to Pro`,
                description: `User has been upgraded to the Pro plan.`,
            });
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, membership: 'Pro' } : u));
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
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage users and credit their investments.
            </CardDescription>
        </div>
         <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('name')}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('email')}>
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('membership')}>
                    Membership <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-48" /></TableCell>
                    </TableRow>
                ))
            ) : filteredAndSortedUsers.map((user) => (
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
                        <Dialog onOpenChange={(isOpen) => { if (!isOpen) setSelectedUser(null); }}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                                    <Eye className='w-4 h-4' />
                                    <span className="sr-only">View Details</span>
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                       <AlertDialog onOpenChange={(open) => !open && setCreditAmount('150')}>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="sm" disabled={!!isSubmitting}>
                                <DollarSign className='w-4 h-4 mr-1' /> Credit
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Credit Investment for {user.name}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Select the investment plan to credit. This will create a new active investment plan for the user.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="credit-amount">Plan Amount (in Rs.)</Label>
                                <Select onValueChange={(value) => setCreditAmount(value)} value={creditAmount} disabled={!!isSubmitting}>
                                    <SelectTrigger id="credit-amount">
                                        <SelectValue placeholder="Select a plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {investmentPlans.map(plan => (
                                            <SelectItem key={plan} value={String(plan)}>{plan} Rs. Plan</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={!!isSubmitting}>
                                    <Trash2 className='w-4 h-4 mr-1' /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User: {user.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user's authentication account and all their associated data in Firestore. Are you sure?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={!!isSubmitting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isSubmitting === user.id}>
                                         {isSubmitting === user.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Yes, delete user
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            ))}
             {!loading && filteredAndSortedUsers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
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
                            <span>{selectedUser.totalInvestmentEarnings || 0} Rs.</span>
                    </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>Referral Earnings</span>
                            </div>
                            <span>{selectedUser.totalReferralEarnings || 0} Rs.</span>
                    </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Gift className="w-4 h-4" />
                                <span>Bonus Earnings</span>
                            </div>
                            <span>{selectedUser.totalBonusEarnings || 0} Rs.</span>
                    </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}
