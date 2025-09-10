
'use client';
import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Gift, PlusCircle, Trash2, Loader2 } from 'lucide-react';
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
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Offer {
    id: string;
    code: string;
    rewardAmount: number;
    maxUsers?: number;
    expiresAt?: Timestamp;
    usageCount: number;
    createdAt: Timestamp;
}

export default function OffersPage() {
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [newCode, setNewCode] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [expiresIn, setExpiresIn] = useState<string | undefined>();

     useEffect(() => {
        const q = collection(db, 'offers');
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const offersData: Offer[] = [];
            querySnapshot.forEach((doc) => {
                offersData.push({ id: doc.id, ...doc.data() } as Offer);
            });
            // Sort by creation date descending
            offersData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
            setOffers(offersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching offers: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch offer codes.' });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleCreateCode = async () => {
        setIsSubmitting(true);
        if (!newCode || !rewardAmount) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide a code and a reward amount.',
            });
            setIsSubmitting(false);
            return;
        }

        let expiresAt: Date | null = null;
        if (expiresIn) {
            expiresAt = new Date();
            if (expiresIn === '1-day') expiresAt.setDate(expiresAt.getDate() + 1);
            if (expiresIn === '7-days') expiresAt.setDate(expiresAt.getDate() + 7);
            if (expiresIn === '30-days') expiresAt.setDate(expiresAt.getDate() + 30);
            if (expiresIn === 'never') expiresAt = null;
        }

        const newOffer = {
            code: newCode.toUpperCase(),
            rewardAmount: Number(rewardAmount),
            maxUsers: maxUsers ? Number(maxUsers) : null,
            expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
            usageCount: 0,
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, 'offers'), newOffer);
             toast({
                title: 'Code Created!',
                description: `New offer code "${newCode.toUpperCase()}" has been created.`,
            });
            // Reset form
            setNewCode('');
            setRewardAmount('');
            setMaxUsers('');
            setExpiresIn(undefined);
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

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: 'Copied!',
            description: `Code "${code}" copied to clipboard.`,
        });
    }

    const deleteCode = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'offers', id));
            toast({
                title: 'Code Deleted!',
                description: `The offer code has been deleted.`,
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: error.message,
            });
        }
    }
    
    const getStatus = (offer: Offer): { text: 'Active' | 'Expired'; variant: 'default' | 'outline' } => {
        if (offer.maxUsers && offer.usageCount >= offer.maxUsers) {
            return { text: 'Expired', variant: 'outline' };
        }
        if (offer.expiresAt && offer.expiresAt.toMillis() < Date.now()) {
             return { text: 'Expired', variant: 'outline' };
        }
        return { text: 'Active', variant: 'default' };
    }

  return (
    <div className='space-y-6'>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5"/>
            <CardTitle>Create New Offer Code</CardTitle>
        </div>
        <CardDescription>
          Generate custom bonus offer codes for users.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" placeholder="e.g., WELCOME100" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} disabled={isSubmitting}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="reward">Reward Amount (₹)</Label>
            <Input id="reward" type="number" placeholder="e.g., 100" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} disabled={isSubmitting}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="max-users">Max Users (Optional)</Label>
            <Input id="max-users" type="number" placeholder="e.g., 100" value={maxUsers} onChange={e => setMaxUsers(e.target.value)} disabled={isSubmitting}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="expires">Expires At (Optional)</Label>
            <Select onValueChange={setExpiresIn} disabled={isSubmitting}>
                <SelectTrigger id="expires">
                    <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1-day">1 Day</SelectItem>
                    <SelectItem value="7-days">7 Days</SelectItem>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardContent>
      <CardFooter>
          <Button onClick={handleCreateCode} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : <PlusCircle className='w-4 h-4 mr-2' />}
            Create Offer Code
        </Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Manage Offer Codes</CardTitle>
        <CardDescription>
          View, manage, and delete existing offer codes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))
            ) : offers.map((offer) => {
                const status = getStatus(offer);
                return (
              <TableRow key={offer.id}>
                <TableCell className="font-mono font-semibold">{offer.code}</TableCell>
                <TableCell>{offer.rewardAmount} Rs.</TableCell>
                <TableCell>
                  <Badge variant={status.variant}
                   className={status.text === 'Active' ? 'bg-green-500/80' : ''}>
                    {status.text}
                  </Badge>
                </TableCell>
                <TableCell>{offer.usageCount} / {offer.maxUsers || '∞'}</TableCell>
                <TableCell className="text-right">
                    <div className='flex gap-2 justify-end'>
                        <Button variant="outline" size="sm" onClick={() => copyCode(offer.code)}>
                            <Copy className='w-4 h-4 mr-1' /> Copy
                        </Button>
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
                                This action cannot be undone. This will permanently delete the offer code "{offer.code}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteCode(offer.id)}>
                                Yes, delete it
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        {!loading && offers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No offer codes found.</p>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
