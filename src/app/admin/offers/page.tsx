
'use client';
import { useState } from 'react';
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
import { Copy, Gift, PlusCircle, Trash2 } from 'lucide-react';
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

interface Offer {
    id: string;
    code: string;
    status: 'Active' | 'Expired';
    usageCount: number;
    rewardAmount?: number;
    maxUsers?: number;
    expiresIn?: string;
}

const mockOffers: Offer[] = [
  {
    id: 'OFR-001',
    code: 'WELCOME50',
    status: 'Active',
    usageCount: 25,
    rewardAmount: 50,
  },
  {
    id: 'OFR-002',
    code: 'SPECIAL10',
    status: 'Active',
    usageCount: 150,
    rewardAmount: 10,
  },
    {
    id: 'OFR-003',
    code: 'EXPIRED20',
    status: 'Expired',
    usageCount: 50,
    rewardAmount: 20,
  },
];

export default function OffersPage() {
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>(mockOffers);
    const [newCode, setNewCode] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [expiresIn, setExpiresIn] = useState<string | undefined>();

    const handleCreateCode = () => {
        if (!newCode || !rewardAmount) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide a code and a reward amount.',
            });
            return;
        }

        const newOffer: Offer = {
            id: `OFR-00${offers.length + 1}`,
            code: newCode,
            status: 'Active',
            usageCount: 0,
            rewardAmount: Number(rewardAmount),
            maxUsers: maxUsers ? Number(maxUsers) : undefined,
            expiresIn: expiresIn,
        };

        setOffers([newOffer, ...offers]);
        toast({
            title: 'Code Created!',
            description: `New offer code "${newCode}" has been created.`,
        });

        // Reset form
        setNewCode('');
        setRewardAmount('');
        setMaxUsers('');
        setExpiresIn(undefined);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: 'Copied!',
            description: `Code "${code}" copied to clipboard.`,
        });
    }

    const deleteCode = (id: string) => {
        setOffers(offers.filter(offer => offer.id !== id));
        toast({
            variant: 'destructive',
            title: 'Code Deleted!',
            description: `The offer code has been deleted.`,
        });
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
            <Input id="code" placeholder="e.g., WELCOME100" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())}/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="reward">Reward Amount (₹)</Label>
            <Input id="reward" type="number" placeholder="e.g., 100" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} />
        </div>
         <div className="space-y-2">
            <Label htmlFor="max-users">Max Users</Label>
            <Input id="max-users" type="number" placeholder="e.g., 100" value={maxUsers} onChange={e => setMaxUsers(e.target.value)} />
        </div>
         <div className="space-y-2">
            <Label htmlFor="expires">Expires At (Optional)</Label>
            <Select onValueChange={setExpiresIn}>
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
          <Button onClick={handleCreateCode}>
            <PlusCircle className='w-4 h-4 mr-2' />
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
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-mono font-semibold">{offer.code}</TableCell>
                <TableCell>{offer.rewardAmount} Rs.</TableCell>
                <TableCell>
                  <Badge variant={offer.status === 'Active' ? 'default' : 'outline'}
                   className={offer.status === 'Active' ? 'bg-green-500/80' : ''}>
                    {offer.status}
                  </Badge>
                </TableCell>
                <TableCell>{offer.usageCount} times</TableCell>
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
                                This action cannot be undone. This will permanently delete the offer code.
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );

    