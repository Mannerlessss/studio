
'use client';
import { useState } from 'react';
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

const mockOffers = [
  {
    id: 'OFR-001',
    code: 'WELCOME50',
    status: 'Active',
    usageCount: 25,
  },
  {
    id: 'OFR-002',
    code: 'SPECIAL10',
    status: 'Active',
    usageCount: 150,
  },
    {
    id: 'OFR-003',
    code: 'EXPIRED20',
    status: 'Expired',
    usageCount: 50,
  },
];

export default function OffersPage() {
    const { toast } = useToast();
    const [offers, setOffers] = useState(mockOffers);

    const generateCode = () => {
        const newCode = `VAULT${Math.floor(100 + Math.random() * 900)}`;
        const newOffer = {
            id: `OFR-00${offers.length + 1}`,
            code: newCode,
            status: 'Active',
            usageCount: 0,
        };
        setOffers([newOffer, ...offers]);
        toast({
            title: 'Code Generated!',
            description: `New offer code "${newCode}" has been created.`,
        });
    }

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Offer Codes</CardTitle>
            <CardDescription>
            Generate and manage bonus offer codes for users.
            </CardDescription>
        </div>
        <Button onClick={generateCode}>
            <PlusCircle className='w-4 h-4 mr-2' />
            Generate Code
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-mono font-semibold">{offer.code}</TableCell>
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
  );
}
