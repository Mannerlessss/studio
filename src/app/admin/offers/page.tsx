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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, PlusCircle, Trash2, Loader2, ArrowUpDown, Search } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

type OfferSortableKeys = 'code' | 'rewardAmount' | 'usageCount' | 'createdAt';

interface Offer {
    id: string;
    code: string;
    rewardAmount: number;
    maxUsers?: number | null;
    expiresAt?: Date | null;
    usageCount: number;
    createdAt: Date;
}

const MOCK_OFFERS: Offer[] = [
    { id: '1', code: 'WELCOME100', rewardAmount: 100, maxUsers: 100, usageCount: 45, createdAt: new Date(Date.now() - 86400000 * 2), expiresAt: new Date(Date.now() + 86400000 * 28)},
    { id: '2', code: 'FREEMONEY', rewardAmount: 50, usageCount: 88, createdAt: new Date(Date.now() - 86400000 * 5), expiresAt: null, maxUsers: null },
    { id: '3', code: 'EXPIRED20', rewardAmount: 20, maxUsers: 50, usageCount: 50, createdAt: new Date(Date.now() - 86400000 * 10), expiresAt: new Date(Date.now() - 86400000) },
    { id: '4', code: 'SPECIAL', rewardAmount: 250, maxUsers: 10, usageCount: 3, createdAt: new Date(Date.now() - 86400000 * 1), expiresAt: new Date(Date.now() + 86400000 * 6) }
];


export default function OffersPage() {
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<OfferSortableKeys>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Form state
    const [newCode, setNewCode] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [expiresIn, setExpiresIn] = useState<string>('never');

     useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setOffers(MOCK_OFFERS);
            setLoading(false);
        }, 500);
    }, []);
    
    const handleSort = (key: OfferSortableKeys) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedOffers = useMemo(() => {
        return offers
            .filter(offer => offer.code.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const aValue = a[sortKey] || 0;
                const bValue = b[sortKey] || 0;

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [offers, searchTerm, sortKey, sortDirection]);


    const handleCreateCode = async () => {
        setIsSubmitting(true);
        toast({
            title: 'Prototype Mode',
            description: 'This action is for demonstration only.',
        });

        if (!newCode || !rewardAmount) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide a code and a reward amount.',
            });
            setIsSubmitting(false);
            return;
        }
        
        let expiresAtDate: Date | null = null;
        if (expiresIn && expiresIn !== 'never') {
            expiresAtDate = new Date();
            if (expiresIn === '1-day') expiresAtDate.setDate(expiresAtDate.getDate() + 1);
            else if (expiresIn === '7-days') expiresAtDate.setDate(expiresAtDate.getDate() + 7);
            else if (expiresIn === '30-days') expiresAtDate.setDate(expiresAtDate.getDate() + 30);
        }

        const newOfferForState: Offer = {
            id: String(Date.now()),
            code: newCode.toUpperCase(),
            rewardAmount: Number(rewardAmount),
            maxUsers: maxUsers ? Number(maxUsers) : null,
            expiresAt: expiresAtDate,
            usageCount: 0,
            createdAt: new Date()
        };

        setOffers(prev => [newOfferForState, ...prev]);
        setNewCode('');
        setRewardAmount('');
        setMaxUsers('');
        setExpiresIn('never');
        setIsSubmitting(false);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: 'Copied!',
            description: `Code "${code}" copied to clipboard.`,
        });
    }

    const deleteCode = async (id: string) => {
        toast({
            title: 'Code Deleted (Prototype)',
            description: `The offer code has been removed from the view.`,
        });
        setOffers(prev => prev.filter(offer => offer.id !== id));
    }
    
    const getStatus = (offer: Offer): { text: 'Active' | 'Expired'; variant: 'default' | 'outline' } => {
        if (offer.maxUsers && offer.usageCount >= offer.maxUsers) {
            return { text: 'Expired', variant: 'outline' };
        }
        if (offer.expiresAt && offer.expiresAt.getTime() < Date.now()) {
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
            <Label htmlFor="reward">Reward Amount (Rs.)</Label>
            <Input id="reward" type="number" placeholder="e.g., 100" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} disabled={isSubmitting}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="max-users">Max Users (Optional)</Label>
            <Input id="max-users" type="number" placeholder="e.g., 100" value={maxUsers} onChange={e => setMaxUsers(e.target.value)} disabled={isSubmitting}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="expires">Expires At (Optional)</Label>
            <Select onValueChange={(value) => setExpiresIn(value)} disabled={isSubmitting} value={expiresIn}>
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
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
            <CardTitle>Manage Offer Codes</CardTitle>
            <CardDescription>
            View, manage, and delete existing offer codes.
            </CardDescription>
        </div>
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search by code..."
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
                 <Button variant="ghost" onClick={() => handleSort('code')}>
                    Code <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('rewardAmount')}>
                    Reward <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>Status</TableHead>
               <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('usageCount')}>
                    Usage <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
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
            ) : filteredAndSortedOffers.map((offer) => {
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
             {!loading && filteredAndSortedOffers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No offer codes found.
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
