'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Loader2, ArrowUpDown, Shapes, Percent, CalendarDays, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, Timestamp, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type PlanSortableKeys = 'amount' | 'dailyInterest' | 'days' | 'createdAt';

interface InvestmentPlan {
    id: string;
    amount: number;
    dailyInterest: number;
    days: number;
    createdAt: Timestamp;
}

export default function PlansPage() {
    const { toast } = useToast();
    const [plans, setPlans] = useState<InvestmentPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortKey, setSortKey] = useState<PlanSortableKeys>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Form state
    const [amount, setAmount] = useState('');
    const [dailyInterest, setDailyInterest] = useState('');
    const [days, setDays] = useState('');

     useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
                const plansSnapshot = await getDocs(q);
                const plansData: InvestmentPlan[] = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentPlan));
                setPlans(plansData);
            } catch (error: any) {
                console.error("Error fetching plans: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch investment plans.' });
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [toast]);
    
    const handleSort = (key: PlanSortableKeys) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedPlans = useMemo(() => {
        return [...plans].sort((a, b) => {
            let aValue, bValue;
            if (sortKey === 'createdAt') {
                aValue = a.createdAt?.toMillis() || 0;
                bValue = b.createdAt?.toMillis() || 0;
            } else {
                aValue = a[sortKey] || 0;
                bValue = b[sortKey] || 0;
            }
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [plans, sortKey, sortDirection]);

    const handleCreatePlan = async () => {
        setIsSubmitting(true);
        if (!amount || !dailyInterest || !days) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all plan details.',
            });
            setIsSubmitting(false);
            return;
        }

        const newPlanData: Omit<InvestmentPlan, 'id' | 'createdAt'> = {
            amount: Number(amount),
            dailyInterest: Number(dailyInterest),
            days: Number(days),
        };

        try {
            const docRef = await addDoc(collection(db, 'plans'), {
                ...newPlanData,
                createdAt: serverTimestamp(),
            });
             toast({
                title: 'Plan Created!',
                description: `New investment plan for ${amount} Rs. has been created.`,
            });
            
             const newPlanForState: InvestmentPlan = {
                id: docRef.id,
                ...newPlanData,
                createdAt: Timestamp.now(),
            };

            setPlans(prev => [newPlanForState, ...prev]);

            // Reset form
            setAmount('');
            setDailyInterest('');
            setDays('');
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Creation Failed',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const deletePlan = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'plans', id));
            toast({
                title: 'Plan Deleted!',
                description: `The investment plan has been deleted.`,
            });
            setPlans(prev => prev.filter(plan => plan.id !== id));
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: error.message,
            });
        }
    }

  return (
    <div className='space-y-6'>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5"/>
            <CardTitle>Create New Investment Plan</CardTitle>
        </div>
        <CardDescription>
          Define a new investment plan available for all users.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (Rs.)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="amount" className="pl-10" type="number" placeholder="e.g., 500" value={amount} onChange={e => setAmount(e.target.value)} disabled={isSubmitting}/>
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="percentage">Daily Interest (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="percentage" className="pl-10" type="number" placeholder="e.g., 10" value={dailyInterest} onChange={e => setDailyInterest(e.target.value)} disabled={isSubmitting}/>
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="duration">Duration (Days)</Label>
             <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="duration" className="pl-10" type="number" placeholder="e.g., 30" value={days} onChange={e => setDays(e.target.value)} disabled={isSubmitting}/>
            </div>
        </div>
      </CardContent>
      <CardFooter>
          <Button onClick={handleCreatePlan} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <PlusCircle className='w-4 h-4 mr-2' />}
            Create Plan
        </Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Shapes className="w-5 h-5"/>
            <CardTitle>Manage Plans</CardTitle>
        </div>
        <CardDescription>
        View, manage, and delete existing investment plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('amount')}>
                    Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('dailyInterest')}>
                    Daily % <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>Daily Return</TableHead>
               <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('days')}>
                    Duration <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>Total Profit</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))
            ) : sortedPlans.map((plan) => {
                const dailyReturn = (plan.amount * plan.dailyInterest) / 100;
                const totalProfit = dailyReturn * plan.days;
                return (
              <TableRow key={plan.id}>
                <TableCell className="font-semibold">{plan.amount} Rs.</TableCell>
                <TableCell>{plan.dailyInterest}%</TableCell>
                <TableCell>{dailyReturn.toFixed(2)} Rs.</TableCell>
                <TableCell>{plan.days} days</TableCell>
                <TableCell className="font-semibold text-green-500">{totalProfit.toFixed(2)} Rs.</TableCell>
                <TableCell className="text-right">
                    <div className='flex gap-2 justify-end'>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm">
                                <Trash2 className='w-4 h-4 mr-1' /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the investment plan for {plan.amount} Rs.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePlan(plan.id)}>
                                Yes, delete it
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </TableCell>
              </TableRow>
            )})}
             {!loading && sortedPlans.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No investment plans found. Create one above to get started.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
