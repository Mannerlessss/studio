# VaultBoost Project Source Code

This file contains the complete source code for your VaultBoost application. You can use this to create a new repository on GitHub or for any other purpose.

---

### File: `.env`

```
```

---

### File: `FEATURES.txt`

```txt
# VaultBoost Application Features

This document provides a detailed breakdown of the features available in the User Panel, Admin Panel, and the Login/Authentication system based on the project's codebase.

---

### 1. Login & Authentication

The authentication system is the entry point for your users, designed to be secure and straightforward.

-   **Unified Login/Signup Page (`/app/login/page.tsx`):**
    -   A single, user-friendly page featuring two tabs: **Login** and **Sign Up**.
    -   **Login:** Existing users can securely log in using their email and password. The interface provides immediate feedback on success or failure.
    -   **Sign Up:** New users can create an account by providing their Full Name, Email, Phone Number, and a Password. It also includes an optional field for a **Referral Code** to track user acquisition channels.

-   **Authentication Context (`/src/contexts/auth-context.tsx`):**
    -   This is the technical core of the user-facing application's authentication. It's built to manage the user's login state seamlessly using Firebase Authentication.
    -   It is currently configured to use mock data, which allows developers to bypass the login screen and work on the application as if they were a logged-in user, speeding up development and testing.

---

### 2. User Panel

This is the main, feature-rich interface for your users after they log in.

-   **Dashboard (`/app/page.tsx`):**
    -   **Welcome Card:** A personalized greeting for the user, displaying their name, membership tier (e.g., "Pro Member"), and current rank (e.g., "Gold").
    -   **Financial Overview:** A set of four prominent cards showing key financial metrics at a glance: total amount invested, total earnings, projected future earnings, and total referral earnings.
    -   **Daily Bonus:** An interactive card that allows users to claim a small, random monetary bonus once every 12 hours, encouraging daily engagement.
    -   **Withdrawals:** A dedicated card where users can initiate withdrawal requests for their available earnings. It supports both **UPI** and **Bank Transfer** methods.
    -   **Transaction History:** A comprehensive list of all financial activities (investments, earnings, bonuses, withdrawals). The list can be filtered by transaction type for easy tracking.
    -   **Upgrade to PRO:** A visually distinct call-to-action card that encourages users on the basic plan to upgrade for higher returns.

-   **Investment Page (`/app/investment/page.tsx`):**
    -   Displays a clear list of all available investment plans. Each plan details the required investment amount, the daily return, and the total potential profit.
    -   Each plan includes an "Invest Now" button, which conveniently directs the user to a pre-filled WhatsApp message to complete the purchase, streamlining the process.

-   **Referral Page (`/app/refer/page.tsx`):**
    -   **Referral Code & Sharing:** Prominently displays the user's unique referral code with a one-click copy button. It also includes integrated "Share on WhatsApp" and "Share Anywhere" buttons.
    -   **Earnings Overview:** Provides a quick summary of referral performance, including the total number of users referred, how many have successfully invested, and the total earnings generated from referrals.
    -   **Leaderboard:** A competitive weekly leaderboard that ranks the **Top Referrers** and **Top Investors**, fostering a sense of community and competition.
    -   **How it Works:** A clear explanation of the referral program's rules and commission structure.

-   **Settings Page (`/app/settings/page.tsx`):**
    -   **Profile Management:** Users can update their personal information, such as their full name and phone number.
    -   **Offer Code Redemption:** A dedicated field where users can enter promotional offer codes to receive bonus rewards.
    -   **Account Security:** Displays the user's verified email address and their active referral code.
    -   **Logout:** A secure logout button for the user to end their session.

---

### 3. Admin Panel

A separate, secure area designed for administrators to manage the application, its users, and financial operations.

-   **Admin Dashboard (`/app/admin/page.tsx`):**
    -   A high-level dashboard providing a quick overview of the application's health with four key metrics: **Total Users**, **Pending Withdrawals**, **Active Offer Codes**, and **Total Investments**.

-   **Users Page (`/app/admin/users/page.tsx`):**
    -   **User Table:** Displays a comprehensive table of all registered users, including their name, email, and current membership status (Basic/Pro).
    -   **Credit Investments:** Allows an admin to manually credit an investment amount directly to a user's account.
    -   **Upgrade Users:** Admins have the ability to upgrade a user's membership from "Basic" to "Pro".
    -   **View User Details:** An admin can click to view a detailed financial breakdown for any user, including their total balance and a split of earnings from investments, referrals, and bonuses.

-   **Withdrawals Page (`/app/admin/withdrawals/page.tsx`):**
    -   **Request Queue:** Shows a list of all pending and historical withdrawal requests. Each entry includes the user's name, requested amount, payment method (UPI/Bank), and their specific payment details.
    -   **Approve/Reject:** Admins can easily approve or reject pending withdrawal requests with a single click, which updates the status in the system.

-   **Offers Page (`/app/admin/offers/page.tsx`):**
    -   **Create Offer Codes:** An admin can generate new promotional offer codes. They can configure the reward amount, set a maximum number of users who can claim it, and define an optional expiration duration.
    -   **Manage Codes:** Displays a table of all existing offer codes with their current status (Active/Expired) and usage count. Admins can also copy a code for distribution or delete it from this table.

```

---

### File: `README.md`

```md
insta# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

```

---

### File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

### File: `firestore.json`

```json
{
  "rules": "firestore.rules",
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "referralCode",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "withdrawals",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "investedReferralCount",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

---

### File: `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

---

### File: `next.config.ts`

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

### File: `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "set-admin": "tsx src/lib/set-admin-claim.ts",
    "clear-test-users": "tsx src/lib/clear-test-users.ts"
  },
  "dependencies": {
    "@genkit-ai/firebase": "^1.19.2",
    "@genkit-ai/googleai": "^1.19.2",
    "@genkit-ai/next": "^1.19.2",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.10.0",
    "firebase-admin": "^12.2.0",
    "genkit": "^1.19.2",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.19.2",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.15.7",
    "typescript": "^5"
  }
}
```

---

### File: `src/ai/flows/delete-user-flow.ts`

```ts
'use server';
/**
 * @fileOverview A server-side flow to securely delete a user from Firebase.
 *
 * This flow handles the deletion of a user from both Firebase Authentication
 * and their corresponding document in the Firestore database. This is a
 * privileged operation that requires the Firebase Admin SDK.
 */
import { z } from 'zod';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function deleteUser(uid: string): Promise<{ success: boolean; message: string; }> {
    const { auth, db } = getFirebaseAdmin();
    
    if (!uid) {
        throw new Error('User UID is required.');
    }
    
    try {
        // Delete from Firebase Authentication
        await auth.deleteUser(uid);

        // Delete from Firestore database
        const userDocRef = db.collection('users').doc(uid);
        
        // Check if the document exists before trying to delete
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            await userDocRef.delete();
        }
        
        // Note: This doesn't delete subcollections like `investments`, `transactions`, etc.
        // For a full cleanup, a more complex script would be needed to recursively delete
        // subcollection documents, but for typical use cases, this is sufficient.

        return {
            success: true,
            message: `Successfully deleted user ${uid} from Authentication and Firestore.`,
        };
    } catch (error: any) {
        console.error(`Failed to delete user ${uid}:`, error);
         // Provide a more user-friendly error message
        if (error.code === 'auth/user-not-found') {
            // If user not in auth, still try to delete from firestore, then return success.
            try {
                const userDocRef = db.collection('users').doc(uid);
                const docSnap = await userDocRef.get();
                if (docSnap.exists) {
                    await userDocRef.delete();
                }
                return {
                    success: true,
                    message: `User ${uid} was already deleted from Authentication. Removed from Firestore.`,
                };
            } catch (dbError: any) {
                 throw new Error(`User not found in Auth, but failed to delete from Firestore: ${dbError.message}`);
            }
        }
        throw new Error(`An error occurred while deleting the user: ${error.message}`);
    }
}
```

---

### File: `src/ai/genkit.ts`

```ts
/**
 * @fileOverview This file is the main entry point for Genkit configuration.
 *
 * It is used to initialize and configure the Genkit AI framework with various plugins.
 * The `ai` object exported from this file is a global singleton that should be used
 * for all Genkit-related operations, such as defining flows, prompts, and tools.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// The `googleAI()` plugin configures Genkit to use Google's generative AI models.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
```

---

### File: `src/app/admin/layout.tsx`

```tsx
'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CircleUser, Gem, Search, HandCoins, Users, Gift, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { AdminBottomNav } from '@/components/vaultboost/admin-bottom-nav';
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/withdrawals', icon: HandCoins, label: 'Withdrawals' },
    { href: '/admin/offers', icon: Gift, label: 'Offers' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Gem className="h-6 w-6 text-primary" />
              <span className="">VaultBoost Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
               {navItems.map(item => (
                 <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
              </Link>
               ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Can add mobile nav toggle here if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-20 md:pb-6">
            {children}
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
```

---

### File: `src/app/admin/offers/page.tsx`

```tsx
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
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type OfferSortableKeys = 'code' | 'rewardAmount' | 'usageCount' | 'createdAt';

interface Offer {
    id: string;
    code: string;
    rewardAmount: number;
    maxUsers?: number | null;
    expiresAt?: Timestamp | null;
    usageCount: number;
    createdAt: Timestamp;
}

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
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const offersSnapshot = await getDocs(collection(db, 'offers'));
                const offersData: Offer[] = offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
                setOffers(offersData);
            } catch (error: any) {
                console.error("Error fetching offers: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch offer codes. Check permissions.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [toast]);
    
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
    }, [offers, searchTerm, sortKey, sortDirection]);


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

        let expiresAtTimestamp: Timestamp | null = null;
        if (expiresIn && expiresIn !== 'never') {
            const expiresAtDate = new Date();
            if (expiresIn === '1-day') expiresAtDate.setDate(expiresAtDate.getDate() + 1);
            else if (expiresIn === '7-days') expiresAtDate.setDate(expiresAtDate.getDate() + 7);
            else if (expiresIn === '30-days') expiresAtDate.setDate(expiresAtDate.getDate() + 30);
            expiresAtTimestamp = Timestamp.fromDate(expiresAtDate);
        }

        const newOfferData: any = {
            code: newCode.toUpperCase(),
            rewardAmount: Number(rewardAmount),
            usageCount: 0,
            createdAt: serverTimestamp(),
        };

        if (maxUsers) {
            newOfferData.maxUsers = Number(maxUsers);
        }

        if (expiresAtTimestamp) {
            newOfferData.expiresAt = expiresAtTimestamp;
        }


        try {
            const docRef = await addDoc(collection(db, 'offers'), newOfferData);
             toast({
                title: 'Code Created!',
                description: `New offer code "${newCode.toUpperCase()}" has been created.`,
            });
            
             const newOfferForState: Offer = {
                id: docRef.id,
                code: newOfferData.code,
                rewardAmount: newOfferData.rewardAmount,
                maxUsers: newOfferData.maxUsers || null,
                expiresAt: newOfferData.expiresAt || null,
                usageCount: 0,
                createdAt: Timestamp.now() // Use client-side timestamp for immediate UI update
            };

            setOffers(prev => [newOfferForState, ...prev]);

            // Reset form
            setNewCode('');
            setRewardAmount('');
            setMaxUsers('');
            setExpiresIn('never');
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
            setOffers(prev => prev.filter(offer => offer.id !== id));
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
```

---

### File: `src/app/admin/page.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HandCoins, Gift, TrendingUp } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, collectionGroup, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
    totalUsers: number;
    pendingWithdrawals: number;
    activeOffers: number;
    totalInvestments: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Total Users
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const totalUsers = usersSnapshot.size;

                // Pending Withdrawals
                const withdrawalsQuery = query(collectionGroup(db, 'withdrawals'), where('status', '==', 'Pending'));
                const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
                const pendingWithdrawals = withdrawalsSnapshot.size;

                // Active Offer Codes
                const offersSnapshot = await getDocs(collection(db, 'offers'));
                const activeOffers = offersSnapshot.docs.filter(doc => {
                    const offer = doc.data();
                    const now = new Date();
                    const isExpiredByDate = offer.expiresAt && (offer.expiresAt as Timestamp).toDate() < now;
                    const isExpiredByUsage = offer.maxUsers && offer.usageCount >= offer.maxUsers;
                    return !isExpiredByDate && !isExpiredByUsage;
                }).length;

                // Total Investments - Sum of 'totalInvested' field from all users
                let totalInvestments = 0;
                usersSnapshot.forEach(doc => {
                    totalInvestments += doc.data().totalInvested || 0;
                });

                setStats({
                    totalUsers,
                    pendingWithdrawals,
                    activeOffers,
                    totalInvestments
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalUsers}</div>}
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Withdrawals
            </CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.pendingWithdrawals}</div>}
            <p className="text-xs text-muted-foreground">
              Requests needing approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Offer Codes
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.activeOffers}</div>}
            <p className="text-xs text-muted-foreground">
              Currently active offers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalInvestments.toLocaleString('en-IN')} Rs.</div>}
            <p className="text-xs text-muted-foreground">
              Total amount invested
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center py-20">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to the Admin Panel
          </h3>
          <p className="text-sm text-muted-foreground">
            Use the bottom navigation to manage your app.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### File: `src/app/admin/users/page.tsx`

```tsx
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
    DialogFooter,
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
import { DollarSign, Crown, Eye, Wallet, Gift, Users, TrendingUp, Loader2, Trash2, ArrowUpDown, Search, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, writeBatch, serverTimestamp, query, where, addDoc, increment, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { deleteUser } from '@/ai/flows/delete-user-flow';


type UserSortableKeys = 'name' | 'email' | 'membership';

interface User {
    id: string;
    name: string;
    email: string;
    membership: 'Basic' | 'Pro';
    hasInvested?: boolean;
    totalBalance: number;
    totalInvestmentEarnings: number;
    totalBonusEarnings: number;
    totalReferralEarnings: number;
    totalInvested: number;
    claimedMilestones?: number[];
    investedReferralCount: number;
    referredBy?: string;
    createdAt?: Timestamp;
}

const investmentPlans = [100, 300, 500, 1000, 2000];
const milestones: { [key: number]: number } = {
  5: 250, 10: 500, 20: 1000, 30: 1500, 40: 2000, 50: 2500,
};

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState('100'); // Default to the smallest plan
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<UserSortableKeys>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersData: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersData);
            } catch (error: any) {
                console.error("Error fetching users: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch users. Check permissions.' });
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

    const handleCredit = async (user: User) => {
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
            const userDocRef = doc(db, 'users', user.id);
            const batch = writeBatch(db);
            const now = serverTimestamp();

            // 1. Create a new document in the `investments` subcollection
            const newInvestmentRef = doc(collection(db, `users/${user.id}/investments`));
            const dailyReturnRate = user.membership === 'Pro' ? 0.13 : 0.10;
            batch.set(newInvestmentRef, {
                planAmount: amount,
                dailyReturn: amount * dailyReturnRate,
                startDate: now,
                lastUpdate: now,
                durationDays: 30,
                earnings: 0,
                status: 'active',
            });

            // 2. Create a transaction record
            const transactionRef = doc(collection(db, `users/${user.id}/transactions`));
            batch.set(transactionRef, {
                type: 'investment',
                amount,
                description: `Invested in Plan ${amount}`,
                status: 'Completed',
                date: now,
            });
            
            // 3. Update the user's main document
            const userUpdates: any = {
                totalInvested: (user.totalInvested || 0) + amount,
            };
            if (!user.hasInvested) {
                userUpdates.hasInvested = true;
                userUpdates.commissionParent = user.referredBy; // Set commission parent on first investment
            }
            batch.update(userDocRef, userUpdates);

            // 4. Handle Referral Logic (if it's the user's first investment >= 100)
            if (!user.hasInvested && user.referredBy && amount >= 100) {
                const referrerDocRef = doc(db, 'users', user.referredBy);
                const referrerDoc = await getDoc(referrerDocRef);

                if (referrerDoc.exists()) {
                    const referrerData = referrerDoc.data() as User;
                    const bonusAmount = 75; // Standard referral bonus

                    // Give welcome bonus to the new investor
                    batch.update(userDocRef, {
                        totalBalance: (user.totalBalance || 0) + bonusAmount,
                        totalBonusEarnings: (user.totalBonusEarnings || 0) + bonusAmount,
                        totalEarnings: ((user as any).totalEarnings || 0) + bonusAmount,
                    });
                    const userBonusTransactionRef = doc(collection(db, `users/${user.id}/transactions`));
                    batch.set(userBonusTransactionRef, {
                        type: 'bonus', amount: bonusAmount, description: `Welcome referral bonus!`, status: 'Completed', date: now,
                    });

                    // Give standard referral bonus to the referrer & increment their count
                    const newReferralCount = (referrerData.investedReferralCount || 0) + 1;
                    batch.update(referrerDocRef, {
                        totalBalance: (referrerData.totalBalance || 0) + bonusAmount,
                        totalReferralEarnings: (referrerData.totalReferralEarnings || 0) + bonusAmount,
                        totalEarnings: ((referrerData as any).totalEarnings || 0) + bonusAmount,
                        investedReferralCount: newReferralCount,
                    });
                    const referrerBonusTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                     batch.set(referrerBonusTransactionRef, {
                        type: 'referral', amount: bonusAmount, description: `Referral bonus from ${user.name}`, status: 'Completed', date: now,
                    });
                    
                    // CHECK FOR MILESTONES
                    const claimedMilestones = referrerData.claimedMilestones || [];
                    for (const milestone in milestones) {
                        const milestoneNum = Number(milestone);
                        if (newReferralCount >= milestoneNum && !claimedMilestones.includes(milestoneNum)) {
                            const rewardAmount = milestones[milestoneNum];
                             batch.update(referrerDocRef, {
                                totalBalance: increment(rewardAmount),
                                totalReferralEarnings: increment(rewardAmount),
                                totalEarnings: increment(rewardAmount),
                                claimedMilestones: [...claimedMilestones, milestoneNum]
                            });

                             const milestoneTransactionRef = doc(collection(db, `users/${user.referredBy}/transactions`));
                             batch.set(milestoneTransactionRef, {
                                type: 'bonus', amount: rewardAmount, description: `Milestone Bonus: ${milestone} referrals`, status: 'Completed', date: now,
                            });
                        }
                    }
                    
                    // Upsert the referred user in the referrer's subcollection
                    const referrerReferralsRef = collection(db, 'users', user.referredBy, 'referrals');
                    const q = query(referrerReferralsRef, where("userId", "==", user.id));
                    const referredUserDocs = await getDocs(q);
                    
                    if (referredUserDocs.empty) {
                         // Add them if they don't exist
                        const newReferralSubDocRef = doc(referrerReferralsRef);
                        batch.set(newReferralSubDocRef, {
                            userId: user.id,
                            name: user.name,
                            email: user.email,
                            hasInvested: true,
                            joinedAt: user.createdAt || serverTimestamp() 
                        });
                    } else {
                        // User already exists, just update their investment status
                        const referredUserDocRef = referredUserDocs.docs[0].ref;
                        batch.update(referredUserDocRef, { hasInvested: true });
                    }
                }
            }
            
            await batch.commit();

            toast({
                title: `Investment Credited`,
                description: `${amount} Rs. has been invested for user ${user.name}.`,
            });
            setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { 
                ...u, 
                hasInvested: true, 
                totalInvested: (u.totalInvested || 0) + amount,
            } : u));
            setCreditAmount('100');
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
            const userDocRef = doc(db, 'users', userId);
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
                       <AlertDialog onOpenChange={(open) => !open && setCreditAmount('100')}>
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
```

---

### File: `src/app/admin/withdrawals/page.tsx`

```tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { CheckCircle, XCircle, Loader2, Search, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, writeBatch, getDoc, collectionGroup, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

type WithdrawalSortableKeys = 'userName' | 'amount' | 'method' | 'date' | 'status';

interface WithdrawalRequest {
  id: string; // Document ID of the withdrawal request
  userId: string;
  userName: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer';
  details: { 
    upiId?: string;
    accountHolder?: string;
    accountNumber?: string;
    ifsc?: string;
  };
  date: any; // Firestore timestamp
  status: 'Pending' | 'Approved' | 'Rejected';
}


export default function WithdrawalsPage() {
    const { toast } = useToast();
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // Store ID of item being submitted
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<WithdrawalSortableKeys>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


    useEffect(() => {
        const fetchWithdrawals = async () => {
            setLoading(true);
            try {
                const withdrawalsQuery = query(collectionGroup(db, 'withdrawals'));
                const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
                const requests: WithdrawalRequest[] = [];
                 withdrawalsSnapshot.forEach(doc => {
                    requests.push({ 
                        id: doc.id,
                        userId: doc.ref.parent.parent!.id,
                        ...doc.data()
                    } as WithdrawalRequest);
                });
                
                setWithdrawals(requests);
            } catch (error: any) {
                console.error("Error fetching withdrawals: ", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch withdrawal requests. Check permissions.' });
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawals();
    }, [toast]);

    const handleSort = (key: WithdrawalSortableKeys) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedWithdrawals = useMemo(() => {
        return withdrawals
            .filter(w => w.userName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                let aValue, bValue;
                if (sortKey === 'date') {
                    aValue = a.date?.toMillis() || 0;
                    bValue = b.date?.toMillis() || 0;
                } else if (sortKey === 'status') {
                     // Custom sort for status: Pending > Approved > Rejected
                    const statusOrder = { 'Pending': 0, 'Approved': 1, 'Rejected': 2 };
                    aValue = statusOrder[a.status];
                    bValue = statusOrder[b.status];
                } 
                else {
                    aValue = a[sortKey];
                    bValue = b[sortKey];
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [withdrawals, searchTerm, sortKey, sortDirection]);

    const handleStatusChange = async (req: WithdrawalRequest, newStatus: 'Approved' | 'Rejected') => {
        setIsSubmitting(req.id);
        const withdrawalDocRef = doc(db, `users/${req.userId}/withdrawals`, req.id);
        
        try {
            const batch = writeBatch(db);

            batch.update(withdrawalDocRef, { status: newStatus });
            
            // Also update the corresponding transaction document
            const transactionQuery = query(
                collection(db, `users/${req.userId}/transactions`), 
                where('type', '==', 'withdrawal'),
                where('amount', '==', req.amount),
                where('status', '==', 'Pending')
            );
            const transactionSnapshot = await getDocs(transactionQuery);
            // This assumes the latest pending withdrawal transaction matches. A more robust system might use a shared ID.
             if (!transactionSnapshot.empty) {
                const transactionDocRef = transactionSnapshot.docs[0].ref;
                batch.update(transactionDocRef, { status: newStatus });
            }


            if (newStatus === 'Rejected') {
                 const userDocRef = doc(db, 'users', req.userId);
                 const userDoc = await getDoc(userDocRef);
                 if (userDoc.exists()) {
                    const userData = userDoc.data();
                    batch.update(userDocRef, {
                        totalBalance: (userData.totalBalance || 0) + req.amount
                    });
                 }
            }

            await batch.commit();

            toast({
                title: `Request ${newStatus}`,
                description: `Withdrawal request for ${req.userName} has been ${newStatus.toLowerCase()}.`,
            });
            
            // Update local state
            setWithdrawals(prev => prev.map(w => w.id === req.id ? {...w, status: newStatus} : w));

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsSubmitting(null);
        }
    }


  return (
    <Card>
       <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>
            Approve or reject withdrawal requests from users.
            </CardDescription>
        </div>
         <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search by user name..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('userName')}>
                    User <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('amount')}>
                    Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('date')}>
                    Date <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                 </Button>
              </TableHead>
              <TableHead className='text-right min-w-[200px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
                 Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-48" /></TableCell>
                    </TableRow>
                ))
            ) : filteredAndSortedWithdrawals.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                <TableCell>{withdrawal.amount} Rs.</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell className='font-mono text-xs'>
                   {withdrawal.method === 'UPI' ? (
                        <span>{withdrawal.details.upiId}</span>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <span>{withdrawal.details.accountHolder}</span>
                            <span>{withdrawal.details.accountNumber}</span>
                            <span>{withdrawal.details.ifsc}</span>
                        </div>
                    )}
                </TableCell>
                <TableCell>{withdrawal.date?.toDate().toLocaleDateString()}</TableCell>
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
                            <Button variant="outline" size="sm" onClick={() => handleStatusChange(withdrawal, 'Approved')} disabled={!!isSubmitting}>
                                {isSubmitting === withdrawal.id ? <Loader2 className='w-4 h-4 mr-1 animate-spin'/> : <CheckCircle className='w-4 h-4 mr-1' />} 
                                Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleStatusChange(withdrawal, 'Rejected')} disabled={!!isSubmitting}>
                                {isSubmitting === withdrawal.id ? <Loader2 className='w-4 h-4 mr-1 animate-spin'/> : <XCircle className='w-4 h-4 mr-1' />}
                                Reject
                            </Button>
                        </div>
                    )}
                </TableCell>
              </TableRow>
            ))}
             {!loading && filteredAndSortedWithdrawals.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No withdrawal requests found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 215 28% 17%;
    --card: 0 0% 100%;
    --card-foreground: 215 28% 17%;
    --popover: 0 0% 100%;
    --popover-foreground: 215 28% 17%;
    --primary: 45 93% 47%;
    --primary-foreground: 24 9.8% 10%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 210 40% 9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 210 39% 55%;
    --accent: 35 92% 62%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 45 93% 47%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.75rem;
  }
  .dark {
    --background: 0 0% 8%;
    --foreground: 210 40% 98%;
    --card: 0 0% 12%;
    --card-foreground: 210 40% 98%;
    --popover: 0 0% 8%;
    --popover-foreground: 210 40% 98%;
    --primary: 45 93% 47%;
    --primary-foreground: 24 9.8% 10%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 0 0% 18%;
    --muted-foreground: 215 20% 65%;
    --accent: 35 92% 62%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 0 0% 18%;
    --input: 0 0% 18%;
    --ring: 45 93% 47%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### File: `src/app/investment/page.tsx`

```tsx
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { InvestmentPlanCard } from '@/components/vaultboost/investment-plan-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const InvestmentPage: NextPage = () => {
  const plans = [
    { amount: 100, dailyReturn: 10, duration: 30, mostPurchased: true, badgeText: 'Everyone Buys' },
    { amount: 300, dailyReturn: 30, duration: 30 },
    { amount: 500, dailyReturn: 50, duration: 30, mostPurchased: true, badgeText: 'Hot' },
    { amount: 1000, dailyReturn: 100, duration: 30 },
    { amount: 2000, dailyReturn: 200, duration: 30 },
  ];
  const { userData } = useAuth();
  const userName = userData?.name || 'User';

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Investment Plans</h2>
        {plans.map((plan, index) => (
          <InvestmentPlanCard key={index} {...plan} userName={userName} />
        ))}

        <Card className="bg-muted/50 border-dashed">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-muted-foreground" />
                    <CardTitle className="text-lg font-semibold">Please Note</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• All investment plans will automatically expire after 30 days from the date of purchase.</p>
                <p>• Daily earnings are credited to your account every 24 hours.</p>
            </CardContent>
        </Card>

      </div>
      <BottomNav activePage="investment" />
    </div>
  );
};

export default InvestmentPage;
```

---

### File: `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VaultBoost',
  description: 'Boost your investments with VaultBoost.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <AuthProvider>
            <div className="relative flex flex-col h-full">
              <main className="flex-grow pb-28">{children}</main>
               <footer className="p-4 text-center text-xs text-muted-foreground space-y-2">
                    <p>This is a risk-based investment product. Please invest at your own discretion.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/terms" className="underline">Terms & Conditions</Link>
                        <Link href="/privacy" className="underline">Privacy Policy</Link>
                    </div>
              </footer>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### File: `src/app/login/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import { Gem, Lock, Mail, Phone, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
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

export default function LoginPage() {
    const { signInWithGoogle, signUpWithEmail, signInWithEmail, loading, sendPasswordReset } = useAuth();
    const { toast } = useToast();

    // Signup state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('');


    const handleSignUp = async () => {
        if (!name || !email || !password || !phone) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all required fields.',
            });
            return;
        }
        await signUpWithEmail({ name, email, phone, password, referralCode });
    };

     const handleSignIn = async () => {
        if (!loginEmail || !loginPassword) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please enter your email and password.',
            });
            return;
        }
        await signInWithEmail({ email: loginEmail, password: loginPassword });
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
            toast({
                variant: 'destructive',
                title: 'Email Required',
                description: 'Please enter your email address.',
            });
            return;
        }
        await sendPasswordReset(resetEmail);
        setResetEmail(''); // Clear the input after sending
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
       <AlertDialog>
        <Tabs defaultValue="login" className="w-full max-w-md">
            <div className="flex flex-col items-center justify-center mb-6 space-y-4">
            <Gem className="w-12 h-12 text-primary" />
            <h1 className="text-2xl font-bold tracking-widest text-primary">
                VAULTBOOST
            </h1>
            </div>
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
            <Card>
                <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to your VaultBoost account to continue.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="your@email.com" className="pl-10" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={loading} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="login-password" type="password" placeholder="••••••••" className="pl-10" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                 <div className="text-right">
                    <AlertDialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
                            Forgot Password?
                        </Button>
                    </AlertDialogTrigger>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </Button>
                </CardFooter>
            </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
            <Card>
                <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                    Join VaultBoost and start growing your investments today.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="name" placeholder="John Doe" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="your@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="referral-code">Referral Code (Optional)</Label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="referral-code" placeholder="e.g. FRIEND123" className="pl-10" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} disabled={loading}/>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        
        {/* Forgot Password Dialog */}
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Forgot Your Password?</AlertDialogTitle>
            <AlertDialogDescription>
                No problem. Enter your email address below and we'll send you a link to reset it.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}
```

---

### File: `src/app/page.tsx`

```tsx
'use client';
import type { NextPage } from 'next';
import { WelcomeCard } from '@/components/vaultboost/welcome-card';
import { InfoCard } from '@/components/vaultboost/info-card';
import { DailyBonusCard } from '@/components/vaultboost/daily-bonus-card';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Wallet, TrendingUp, Users, PiggyBank, Gem } from 'lucide-react';
import { UpgradeCard } from '@/components/vaultboost/upgrade-card';
import { WithdrawCard } from '@/components/vaultboost/withdraw-card';
import { TransactionHistoryCard } from '@/components/vaultboost/transaction-history-card';
import { Header } from '@/components/vaultboost/header';
import { useAuth } from '@/contexts/auth-context';
import { GuidedTour } from '@/components/vaultboost/guided-tour';
import { ProfileCompletionCard } from '@/components/vaultboost/profile-completion-card';
import { AnnouncementPopup } from '@/components/vaultboost/announcement-popup';
import { ActiveInvestmentsCard } from '@/components/vaultboost/active-investments-card';
import { CollectBonusCard } from '@/components/vaultboost/collect-bonus-card';


const Dashboard: NextPage = () => {
  const { userData, loading, claimDailyBonus, totalROI } = useAuth();

  if (loading || !userData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
            </div>
        </div>
      );
  }
  
  const handleBonusClaim = (amount: number) => {
    claimDailyBonus(amount);
  };
  
  return (
    <div className="bg-background min-h-full">
      <Header />
      <AnnouncementPopup />
      <GuidedTour />
      <div className="p-4 space-y-6">
        <div id="welcome-card">
          <WelcomeCard name={userData.name} membership={`${userData.membership} Member`} />
        </div>
        <CollectBonusCard />
        <ProfileCompletionCard />
        <div className="grid grid-cols-2 gap-4" id="info-cards">
          <InfoCard
            title="Invested"
            value={`${userData.totalInvested || 0} Rs.`}
            icon={<Wallet className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Earnings"
            value={`${userData.totalEarnings || 0} Rs.`}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
           <InfoCard
            title="Total ROI"
            value={`300% (${totalROI.toLocaleString('en-IN')} Rs.)`}
            icon={<PiggyBank className="h-6 w-6 text-primary" />}
          />
          <InfoCard
            title="Referral"
            value={`${userData.totalReferralEarnings || 0} Rs.`}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
        </div>
        <ActiveInvestmentsCard />
        <DailyBonusCard onBonusClaim={handleBonusClaim} />
        <div id="withdraw-card">
            <WithdrawCard />
        </div>
        <TransactionHistoryCard />
        <UpgradeCard userName={userData.name}/>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default Dashboard;
```

---

### File: `src/app/privacy/page.tsx`

```tsx
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PrivacyPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>Last updated: October 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert">
                <p>Your privacy is important to us. It is VaultBoost's policy to respect your privacy regarding any information we may collect from you across our app.</p>

                <h2>1. Information We Collect</h2>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and provide the features and functionality of the app, to analyze how the service is used, diagnose service or technical problems, maintain security, and personalize content.</p>

                <h2>3. Data Security</h2>
                <p>We are committed to protecting the security of your personal information. We use a variety of security technologies and procedures to help protect your personal information from unauthorized access, use, or disclosure.</p>

                <h2>4. Your Consent</h2>
                <p>By using our app, you hereby consent to our Privacy Policy and agree to its terms.</p>
                
            </CardContent>
        </Card>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default PrivacyPage;
```

---

### File: `src/app/pro/page.tsx`

```tsx
'use client';
import type { NextPage } from 'next';
import { BottomNav } from '@/components/vaultboost/bottom-nav';

const ProPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="p-4 space-y-6">
        {/* Content moved to dashboard */}
      </div>
      <BottomNav activePage="pro" />
    </div>
  );
};

export default ProPage;
```

---

### File: `src/app/ref/[code]/page.tsx`

```tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gem } from 'lucide-react';

// This page will capture the referral code from the URL,
// store it in localStorage, and redirect to the signup page.
export default function ReferralPage({ params }: { params: { code: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (params.code) {
      // Store the referral code so the signup page can use it
      localStorage.setItem('referralCode', params.code);
      // Redirect to the main login/signup page
      router.push('/login');
    } else {
        // If no code, just go to login
        router.push('/login');
    }
  }, [params.code, router]);

  // Render a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
        <p className="text-lg text-muted-foreground">Applying referral code...</p>
      </div>
    </div>
  );
}
```

---

### File: `src/app/refer/page.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Gift, Users, Star, Share2, MessageCircle, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { ReferralMilestonesCard } from '@/components/vaultboost/referral-milestones-card';
import { ReferralLeaderboardCard } from '@/components/vaultboost/referral-leaderboard-card';

interface ReferredUser {
    id: string;
    name: string;
    email: string;
    hasInvested: boolean;
}

const ReferPage: NextPage = () => {
    const { toast } = useToast();
    const { user, userData } = useAuth();
    const [referralStats, setReferralStats] = useState({
        totalReferred: 0,
        successfullyInvested: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);
    
    const referralCode = userData?.referralCode || '...';
    const referralLink = `https://vaultboost.app/ref/${referralCode}`;
    const shareMessage = `Check out VaultBoost! I'm earning money by investing. Join using my code and you can earn too! My referral code is ${referralCode}. Link: ${referralLink}`;

    useEffect(() => {
        if (!user) return;

        const referralsRef = collection(db, `users/${user.uid}/referrals`);
        const q = query(referralsRef);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const referredUsers = querySnapshot.docs.map(doc => doc.data() as ReferredUser);
            const totalReferred = referredUsers.length;
            const successfullyInvested = referredUsers.filter(u => u.hasInvested).length;
            
            setReferralStats({
                totalReferred,
                successfullyInvested
            });
            setLoadingStats(false);
        }, (error) => {
            console.error("Failed to fetch referrals:", error);
            setLoadingStats(false);
        });

        return () => unsubscribe();
    }, [user]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copied to clipboard!",
            description: "Your referral code has been copied.",
        });
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(shareMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    const shareAnywhere = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on VaultBoost!',
                    text: shareMessage,
                    url: referralLink,
                });
            } catch (error) {
                console.error('Error sharing:', error);
                // Fallback to copying link if sharing fails
                copyToClipboard();
                toast({
                    title: "Sharing failed, link copied instead.",
                });
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyToClipboard();
            toast({
                title: "Web Share not supported, link copied instead.",
            });
        }
    };


  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6 text-center">
        <h2 className="text-2xl font-bold">Turn your network into your net worth!</h2>
        <div className="p-4 rounded-lg border border-primary">
          <p className="text-lg text-foreground">Earn <span className="font-bold text-primary">75 Rs.</span> for every friend who joins the action.</p>
        </div>
        <p className="flex items-center justify-center gap-2 text-accent font-semibold">
            <Star className="w-5 h-5" />
            Unlimited Earning Potential
            <Star className="w-5 h-5" />
        </p>

        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card">
                <CardContent className="p-4">
                    {loadingStats ? <Skeleton className="h-8 w-1/2 mx-auto" /> : <p className="text-3xl font-bold">{referralStats.totalReferred}</p>}
                    <p className="text-xs flex items-center justify-center gap-1"><Users className='w-3 h-3'/> Total Referred</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="p-4">
                    {loadingStats ? <Skeleton className="h-8 w-1/2 mx-auto" /> : <p className="text-3xl font-bold">{userData?.investedReferralCount || 0}</p>}
                    <p className="text-xs flex items-center justify-center gap-1"><Star className='w-3 h-3' /> Successfully Invested</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="p-4">
                    {userData ? <p className="text-3xl font-bold">{userData?.totalReferralEarnings || 0} <span className='text-xl'>Rs.</span></p> : <Skeleton className="h-8 w-1/2 mx-auto" />}
                    <p className="text-xs flex items-center justify-center gap-1"><Gift className='w-3 h-3' /> Total Earnings</p>
                </CardContent>
            </Card>
        </div>


        <Card className="text-center shadow-lg border border-primary">
            <CardHeader>
                <div className='flex justify-center items-center gap-3 mb-2'>
                    <Gift className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-bold">Your Magic Code</CardTitle>
                    <Badge>Premium</Badge>
                </div>
                <CardDescription>Share this golden ticket with friends and watch your earnings grow!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-muted-foreground mb-2 text-sm">Your Referral Code</p>
                    <div className="flex items-center justify-center p-3 border-dashed border-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-mono font-bold tracking-widest mr-4">{referralCode}</p>
                        <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                            <Copy className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>

                <div className='space-y-3 pt-2'>
                    <Button className='w-full' size='lg' onClick={shareOnWhatsApp}>
                        <MessageCircle className='mr-2'/>
                        Share on WhatsApp
                    </Button>
                    <Button className='w-full' variant='secondary' size='lg' onClick={shareAnywhere}>
                        <Share2 className='mr-2'/>
                        Share Anywhere
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <ReferralLeaderboardCard />
        <ReferralMilestonesCard successfullyInvested={userData?.investedReferralCount || 0} />

         <Card className="text-left shadow-lg">
            <CardHeader>
                <CardTitle>How The Magic Happens</CardTitle>
            </CardHeader>
             <CardContent className="text-sm text-muted-foreground space-y-3">
                 <p>1. Share your referral code with your friends.</p>
                 <p>2. Your friend signs up and invests at least 100 Rs. in a plan.</p>
                 <p>3. You get a <span className='font-bold text-primary'>75 Rs.</span> bonus instantly! (Only after your friend's first investment of 100 Rs. or more)</p>
                 <p>4. You also get a <span className='font-bold text-primary'>3% commission</span> on all their future earnings, forever!</p>
             </CardContent>
        </Card>
      </div>
      <BottomNav activePage="refer" />
    </div>
  );
};

export default ReferPage;
```

---

### File: `src/app/settings/page.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Gift, Shield, LogOut, Loader2, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const SettingsPage: NextPage = () => {
    const { userData, logOut, updateUserPhone, updateUserName } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

    useEffect(() => {
      if (userData) {
        setName(userData.name || '');
        setPhone(userData.phone || '');
      }
    }, [userData]);

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: error.message,
            });
        }
    }

    const handleUpdateName = async () => {
        if (!name || name === userData?.name) {
            return;
        }
        setIsUpdatingName(true);
        try {
            await updateUserName(name);
             toast({
                title: 'Success!',
                description: 'Your name has been updated.',
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleUpdatePhone = async () => {
        if (!phone || phone === userData?.phone) {
            return;
        }
        setIsUpdatingPhone(true);
        try {
            await updateUserPhone(phone);
             toast({
                title: 'Success!',
                description: 'Your phone number has been updated.',
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message,
            });
        } finally {
            setIsUpdatingPhone(false);
        }
    };

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">My Account</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
               <div className="flex gap-2">
                <Input id="full-name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleUpdateName} disabled={isUpdatingName || !name || name === userData?.name}>
                  {isUpdatingName ? <Loader2 className="animate-spin"/> : 'Update'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phone-number" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button onClick={handleUpdatePhone} disabled={isUpdatingPhone || !phone || phone === userData?.phone}>
                  {isUpdatingPhone ? <Loader2 className="animate-spin"/> : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle>Account Security</CardTitle>
            </div>
             <CardDescription>Manage your account security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-semibold">{userData?.email}</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
            </div>
            <div className="flex justify-between items-center">
                 <div>
                    <p className="text-sm text-muted-foreground">Your Referral Code</p>
                    <p className="font-semibold">{userData?.referralCode || 'N/A'}</p>
                </div>
                {userData?.referralCode && <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Active</Badge>}
            </div>
             {userData?.usedReferralCode && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Referred By Code
                  </p>
                  <p className="font-semibold">{userData.usedReferralCode}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                >
                  Applied
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
        </Button>

      </div>
      <BottomNav activePage="settings" />
    </div>
  );
};

export default SettingsPage;
```

---

### File: `src/app/support/page.tsx`

```tsx
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, LifeBuoy, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const SupportPage: NextPage = () => {
  const email = 'gagansharma.gs107@gmail.com';
  const phoneNumber = '7888540806';
  const mailtoLink = `mailto:${email}`;
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-center">Customer Support</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <LifeBuoy className="w-6 h-6 text-primary" />
              <CardTitle>Get in Touch</CardTitle>
            </div>
            <CardDescription>We're here to help you with any questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                    <p className="font-semibold">WhatsApp (Only)</p>
                    <p className="text-muted-foreground">{phoneNumber}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">Email Address</p>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold">Support Hours</p>
                <p className="text-muted-foreground">9 AM to 6 PM</p>
              </div>
            </div>
             <div className='space-y-3'>
                <Link href={whatsappLink} className="w-full" target="_blank">
                    <Button className="w-full" size='lg'>
                        <MessageCircle className="mr-2" /> Chat on WhatsApp
                    </Button>
                </Link>
                <Link href={mailtoLink} className="w-full" target="_blank">
                    <Button className="w-full" variant='secondary' size='lg'>
                        <Mail className="mr-2" /> Send an Email
                    </Button>
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav activePage={'dashboard'} />
    </div>
  );
};

export default SupportPage;
```

---

### File: `src/app/terms/page.tsx`

```tsx
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const TermsPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Last updated: October 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert">
                <p>Welcome to VaultBoost. These terms and conditions outline the rules and regulations for the use of our application.</p>

                <h2>1. Introduction</h2>
                <p>By accessing this app, we assume you accept these terms and conditions. Do not continue to use VaultBoost if you do not agree to all of the terms and conditions stated on this page.</p>

                <h2>2. Investments & Returns</h2>
                <p>All investments made through VaultBoost are subject to market risks. The returns are not guaranteed and may vary. We are not liable for any financial losses incurred.</p>

                <h2>3. User Account</h2>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                <h2>4. Prohibited Activities</h2>
                <p>You are prohibited from using the service for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, or state regulations, rules, laws, or local ordinances.</p>
                
                <h2>5. Changes to Terms</h2>
                <p>We reserve the right to revise these terms at any time. By using this app, you are expected to review these terms on a regular basis.</p>
            </CardContent>
        </Card>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
};

export default TermsPage;
```

---

### File: `src/components/ui/accordion.tsx`

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

---

### File: `src/components/ui/alert-dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

---

### File: `src/components/ui/alert.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

---

### File: `src/components/ui/avatar.tsx`

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

---

### File: `src/components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---

### File: `src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

### File: `src/components/ui/calendar.tsx`

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

---

### File: `src/components/ui/card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

### File: `src/components/ui/carousel.tsx`

```tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

---

### File: `src/components/ui/chart.tsx`

```tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

---

### File: `src/components/ui/checkbox.tsx`

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

---

### File: `src/components/ui/collapsible.tsx`

```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

---

### File: `src/components/ui/dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

---

### File: `src/components/ui/dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

---

### File: `src/components/ui/form.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

---

### File: `src/components/ui/input.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

---

### File: `src/components/ui/label.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

### File: `src/components/ui/menubar.tsx`

```tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

---

### File: `src/components/ui/popover.tsx`

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

---

### File: `src/components/ui/progress.tsx`

```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

---

### File: `src/components/ui/radio-group.tsx`

```tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

---

### File: `src/components/ui/scroll-area.tsx`

```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

---

### File: `src/components/ui/select.tsx`

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

---

### File: `src/components/ui/separator.tsx`

```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

---

### File: `src/components/ui/sheet.tsx`

```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

---

### File: `src/components/ui/skeleton.tsx`

```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

---

### File: `src/components/ui/slider.tsx`

```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

---

### File: `src/components/ui/switch.tsx`

```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

---

### File: `src/components/ui/table.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

---

### File: `src/components/ui/tabs.tsx`

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

---

### File: `src/components/ui/textarea.tsx`

```tsx
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
```

---

### File: `src/components/ui/toast.tsx`

```tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

---

### File: `src/components/ui/toaster.tsx`

```tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

---

### File: `src/components/ui/tooltip.tsx`

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

---

### File: `src/components/vaultboost/active-investments-card.tsx`

```tsx
'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth, Investment } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const InvestmentItem: FC<{ investment: Investment }> = ({ investment }) => {
    
    const daysProcessed = Math.round(investment.earnings / investment.dailyReturn);
    const progress = (daysProcessed / investment.durationDays) * 100;
    const dailyReturnRate = (investment.dailyReturn / investment.planAmount) * 100;

    return (
        <div className="p-4 rounded-lg bg-muted/50 border relative">
            <div className="grid grid-cols-2 gap-y-4">
                <div>
                    <p className="text-2xl font-bold text-primary">{investment.planAmount.toLocaleString()} Rs.</p>
                    <p className="text-sm text-muted-foreground">Plan Active</p>
                </div>
                <div className='text-right'>
                    <p className="text-2xl font-bold text-green-500">{investment.earnings.toLocaleString()} Rs.</p>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-500 text-white shadow-lg">{dailyReturnRate.toFixed(0)}% Daily</Badge>
            </div>

            <div className="mt-4 col-span-2 space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <p>Progress</p>
                    <p>{progress.toFixed(0)}%</p>
                </div>
                <Progress value={progress} />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <p>Day {daysProcessed} of {investment.durationDays}</p>
                    <p>Daily: {investment.dailyReturn.toLocaleString()} Rs.</p>
                </div>
            </div>
        </div>
    );
};

export const ActiveInvestmentsCard: FC = () => {
    const { userData } = useAuth();
    const activeInvestments = useMemo(() => {
        return userData?.investments?.filter(inv => inv.status === 'active') || [];
    }, [userData?.investments]);

    if (activeInvestments.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Active Investments</CardTitle>
                    <CardDescription>Your current investment performance</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-10">
                    <TrendingUp className="mx-auto w-12 h-12 mb-4" />
                    <p className="font-semibold">No Active Investments</p>
                    <p className="text-sm mb-4">Start investing to see your earnings grow.</p>
                    <Link href="/investment">
                        <Button>View Investment Plans</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Investments</CardTitle>
        <CardDescription>Your current investment performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeInvestments.map(inv => (
            <InvestmentItem key={inv.id} investment={inv} />
        ))}
      </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/admin-bottom-nav.tsx`

```tsx
'use client';
import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandCoins, Users, Gift, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const AdminBottomNav: FC = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/withdrawals', icon: HandCoins, label: 'Withdrawals' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/offers', icon: Gift, label: 'Offers' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg z-10 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
           const isActive = pathname === item.href;
           return (
              <Link href={item.href} key={item.label} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                      'flex flex-col items-center justify-center h-full w-full rounded-none',
                      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
           )
        })}
      </div>
    </div>
  );
};
```

---

### File: `src/components/vaultboost/announcement-popup.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const POPUP_STORAGE_KEY = 'vaultboost-announcement-seen';

  useEffect(() => {
    // Use sessionStorage to show popup once per session
    const hasSeenPopup = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md" onInteractOutside={handleClose}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-primary/10 rounded-full">
                <Gift className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Welcome to VaultBoost!
          </DialogTitle>
          <DialogDescription className="text-center">
            Here are some of our amazing benefits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">200 Rs. Sign-up Bonus:</span> New users get a 200 Rs. bonus automatically on sign up!</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Daily Bonus Game:</span> Play every 4 hours to win a random cash prize.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Refer & Earn Big:</span> Get 75 Rs. for each new investor you refer, plus milestone bonuses up to 2,500 Rs.</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Fast Withdrawals:</span> Get your earnings processed quickly and easily.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="https://wa.me/7888540806" target="_blank" className="w-full">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <MessageCircle className="mr-2" /> Chat on WhatsApp
            </Button>
          </Link>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### File: `src/components/vaultboost/bottom-nav.tsx`

```tsx
'use client';
import type { FC } from 'react';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activePage: 'dashboard' | 'investment' | 'refer' | 'settings' | 'support';
}

export const BottomNav: FC<BottomNavProps> = ({ activePage }) => {
  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { href: '/investment', icon: TrendingUp, label: 'Investment', page: 'investment' },
    { href: '/refer', icon: Users, label: 'Refer', page: 'refer' },
    { href: '/settings', icon: Settings, label: 'Settings', page: 'settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label} className="flex-1" id={`bottom-nav-${item.page}`}>
            <Button
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center h-full w-full rounded-none',
                activePage === item.page
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};
```

---

### File: `src/components/vaultboost/collect-bonus-card.tsx`

```tsx
'use client';

import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export const CollectBonusCard: FC = () => {
    const { userData, collectSignupBonus } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    if (!userData || userData.hasCollectedSignupBonus) {
        return null;
    }

    const handleCollect = async () => {
        setIsLoading(true);
        try {
            await collectSignupBonus();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error collecting bonus',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground border-none">
            <CardHeader>
                <CardTitle>Your Sign-up Bonus is Ready!</CardTitle>
                <CardDescription className="text-primary-foreground/90">
                    Welcome to VaultBoost! Collect your starting bonus.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-5xl font-bold">200 <span className="text-3xl">Rs.</span></p>
                <Button 
                    className="bg-background text-primary hover:bg-background/90 w-full" 
                    size="lg"
                    onClick={handleCollect}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Gift className="mr-2" />}
                    Collect Your Bonus
                </Button>
            </CardContent>
        </Card>
    );
};
```

---

### File: `src/components/vaultboost/daily-bonus-card.tsx`

```tsx
'use client';
import { FC, useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Gift, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface DailyBonusCardProps {
  onBonusClaim: (amount: number) => void;
}

const prizeAmounts = [1, 2, 3, 4, 5, 6, 7, 8];

// Function to shuffle an array
const shuffle = (array: number[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


export const DailyBonusCard: FC<DailyBonusCardProps> = ({ onBonusClaim }) => {
  const { userData } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [bonusAvailable, setBonusAvailable] = useState<boolean>(false);

  const [gameState, setGameState] = useState<'ready' | 'picked' | 'revealed'>('ready');
  const [userChoiceIndex, setUserChoiceIndex] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<number[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);

  const wonAmount = useMemo(() => {
    if (userChoiceIndex !== null) {
      return prizes[userChoiceIndex];
    }
    return null;
  }, [userChoiceIndex, prizes]);


  useEffect(() => {
    handleGameReset();
  }, []);

  useEffect(() => {
    if (!userData?.lastBonusClaim) {
        setBonusAvailable(true);
        return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      const lastClaimTime = userData.lastBonusClaim!.toDate().getTime();
        
      const fourHours = 4 * 60 * 60 * 1000;
      const timeSinceClaim = now - lastClaimTime;

      if (timeSinceClaim >= fourHours) {
        setBonusAvailable(true);
        setTimeRemaining('');
        handleGameReset();
        clearInterval(interval);
      } else {
        setBonusAvailable(false);
        const remaining = fourHours - timeSinceClaim;
        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData?.lastBonusClaim]);

  const handleGameReset = () => {
    setPrizes(shuffle([...prizeAmounts]));
    setGameState('ready');
    setUserChoiceIndex(null);
    setIsCollecting(false);
  };
  
  const handleSuitcasePick = (index: number) => {
    if (gameState !== 'ready') return;

    setUserChoiceIndex(index);
    setGameState('picked');

    setTimeout(() => {
      setGameState('revealed');
    }, 2000); // Wait 2 seconds before revealing all
  };

  const handleCollect = () => {
    if (gameState !== 'revealed' || wonAmount === null || isCollecting) return;
    
    setIsCollecting(true);
    onBonusClaim(wonAmount);
    setBonusAvailable(false); // UI will update via useEffect on next render
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-accent" />
          <CardTitle className="text-lg font-semibold">Daily Bonus Game</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center flex flex-col items-center justify-center space-y-4 relative">
        {!bonusAvailable ? (
          <>
            <p className="text-muted-foreground">
              Come back in <span className="font-semibold text-primary">{timeRemaining}</span> for your next bonus.
            </p>
          </>
        ) : (
          <>
            {gameState === 'ready' && <p className="text-muted-foreground">Pick a suitcase to reveal your prize!</p>}
            {gameState === 'picked' && <p className="text-muted-foreground animate-pulse">Revealing prizes...</p>}
            {gameState === 'revealed' && <p className="text-muted-foreground">You won {wonAmount} Rs!</p>}

            <div className="grid grid-cols-4 gap-4 w-full">
              {prizes.map((prize, index) => {
                const isPicked = userChoiceIndex === index;
                const isRevealed = gameState === 'revealed';
                
                return (
                  <div key={index} className="perspective-1000">
                    <button
                      onClick={() => handleSuitcasePick(index)}
                      disabled={gameState !== 'ready'}
                      className={cn(
                        "w-full h-16 md:h-20 preserve-3d transition-transform duration-1000",
                        isRevealed ? 'rotate-y-180' : ''
                      )}
                    >
                      {/* Front of suitcase */}
                      <div className={cn(
                        "absolute w-full h-full backface-hidden rounded-lg border-2 border-amber-700 bg-amber-500 flex items-center justify-center cursor-pointer",
                        "hover:animate-shake disabled:cursor-not-allowed disabled:hover:animate-none",
                         isPicked && !isRevealed ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
                      )}>
                        <Briefcase className="w-8 h-8 text-amber-900" />
                      </div>
                      {/* Back of suitcase (prize) */}
                      <div className={cn(
                        "absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center rotate-y-180",
                         isPicked ? "bg-primary text-primary-foreground border-2 border-primary" : "bg-muted text-muted-foreground border"
                      )}>
                        <span className="text-2xl font-bold">{prize}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            
            {gameState === 'revealed' && (
              <Button onClick={handleCollect} size="lg" className="animate-bounce mt-6" disabled={isCollecting}>
                {isCollecting ? <Loader2 className="animate-spin" /> : `Collect ${wonAmount} Rs.`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/fab.tsx`

```tsx
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const Fab: FC = () => {
  return (
    <Button
      size="icon"
      className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary shadow-lg"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};
```

---

### File: `src/components/vaultboost/guided-tour.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';

const tourSteps = [
  {
    title: 'Welcome to VaultBoost!',
    content: 'Let\'s take a quick tour of the app to get you started.',
    targetId: 'welcome-card',
  },
  {
    title: 'Your Dashboard',
    content: 'Here you can see your key stats like invested amount, earnings, and referrals at a glance.',
    targetId: 'info-cards',
  },
  {
    title: 'Investment Plans',
    content: 'Head over to the Investment page to see available plans and start earning.',
    targetId: 'bottom-nav-investment',
  },
  {
    title: 'Refer & Earn',
    content: 'Invite your friends using your unique code from the Refer page and earn commissions!',
    targetId: 'bottom-nav-refer',
  },
    {
    title: 'Withdraw Funds',
    content: 'Easily withdraw your earnings. We\'ll guide you through the process here.',
    targetId: 'withdraw-card',
  },
];

export function GuidedTour() {
  const [step, setStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('vaultboost-tour-completed');
    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleEndTour();
    }
  };

  const handleEndTour = () => {
    setShowTour(false);
    localStorage.setItem('vaultboost-tour-completed', 'true');
  };

  if (!showTour) {
    return null;
  }

  const currentStep = tourSteps[step];
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
       <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-90">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg mb-2">{currentStep.title}</h3>
                        <p className="text-sm text-muted-foreground">{currentStep.content}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleEndTour}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-muted-foreground">
                        {step + 1} / {tourSteps.length}
                    </span>
                    <Button size="sm" onClick={handleNext}>
                       {step === tourSteps.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
```

---

### File: `src/components/vaultboost/header.tsx`

```tsx
'use client';
import type { FC } from 'react';
import { Headset, Crown, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Header: FC = () => {
  const pathname = usePathname();
  const isReferPage = pathname === '/refer';
  const headerClasses = 'bg-card text-foreground';
  const buttonClasses = 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground';
  const iconColor = 'text-primary';
  const proIconColor = 'text-primary';

  return (
    <header className={`flex items-center justify-between p-4 border-b ${headerClasses}`}>
      <div className="flex items-center gap-3">
        <Gem className={`w-8 h-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold font-headline">VaultBoost</h1>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/support">
          <Button variant="ghost" size="icon" className={buttonClasses}>
            <Headset className="h-5 w-5" />
            <span className="sr-only">Customer Support</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className={buttonClasses}>
          <Crown className={`h-5 w-5 ${proIconColor}`} />
          <span className="sr-only">Pro Plan</span>
        </Button>
      </div>
    </header>
  );
};
```

---

### File: `src/components/vaultboost/info-card.tsx`

```tsx
import type { FC, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  isStatus?: boolean;
}

export const InfoCard: FC<InfoCardProps> = ({ title, value, icon, isStatus = false }) => {
  return (
    <Card className="shadow-md bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        {isStatus ? (
          <Badge variant="outline" className="font-semibold border-primary text-primary">{value}</Badge>
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/investment-plan-card.tsx`

```tsx
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InvestmentPlanCardProps {
  amount: number;
  dailyReturn: number;
  duration: number;
  mostPurchased?: boolean;
  badgeText?: string;
  userName?: string;
}

export const InvestmentPlanCard: FC<InvestmentPlanCardProps> = ({
  amount,
  dailyReturn,
  duration,
  mostPurchased = false,
  badgeText = 'Most Purchased',
  userName = 'User',
}) => {
  const totalProfit = dailyReturn * duration;
  const message = `Hi, I'm ${userName} and I want to buy the plan for ${amount} Rs.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  return (
    <Card className={cn('shadow-lg relative overflow-hidden', mostPurchased ? 'border-primary border-2' : '')}>
      {mostPurchased && (
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          <Star className="w-3 h-3 mr-1" />
          {badgeText}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className={cn('text-2xl font-bold', mostPurchased ? 'text-primary' : '')}>Plan {amount} Rs.</CardTitle>
        <CardDescription>Invest {amount} Rs. and get 10% daily.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Daily Earning</span>
          <span className="font-semibold">{dailyReturn} Rs.</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Contract Days</span>
          <span className="font-semibold">{duration} Days</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-muted-foreground font-semibold">Total Profit</span>
          <span className="font-bold text-green-500">{totalProfit} Rs.</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={whatsappUrl} className="w-full" target="_blank">
            <Button className="w-full" size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Invest Now
            </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/profile-completion-card.tsx`

```tsx
'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { UserCheck } from 'lucide-react';

export const ProfileCompletionCard: FC = () => {
  const { userData } = useAuth();

  const completionPercent = useMemo(() => {
    if (!userData) return 0;
    let score = 0;
    const totalFields = 3; // name, phone, email
    if (userData.name && userData.name !== 'Vault User') score++;
    if (userData.phone) score++;
    if (userData.email) score++;
    return Math.round((score / totalFields) * 100);
  }, [userData]);

  if (completionPercent === 100) {
    return null; // Don't show the card if the profile is complete
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-primary" />
          <CardTitle className="text-lg font-semibold">Complete Your Profile</CardTitle>
        </div>
        <CardDescription>
          A complete profile helps us secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Profile Completion</p>
            <p className="text-sm font-bold text-primary">{completionPercent}%</p>
          </div>
          <Progress value={completionPercent} />
        </div>
        <Link href="/settings">
          <Button className="w-full" variant="secondary">
            Go to Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/referral-leaderboard-card.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface LeaderboardUser {
    name: string;
    investedReferralCount: number;
}

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
        case 1: return <Medal className="w-5 h-5 text-slate-400" />;
        case 2: return <Star className="w-5 h-5 text-yellow-700" />;
        default: return <span className="text-sm font-bold w-5 text-center">{rank + 1}</span>;
    }
}

const getRankColor = (rank: number) => {
    switch (rank) {
        case 0: return 'border-yellow-500/50 bg-yellow-500/5';
        case 1: return 'border-slate-400/50 bg-slate-500/5';
        case 2: return 'border-yellow-700/50 bg-yellow-700/5';
        default: return 'bg-muted/50';
    }
}

export const ReferralLeaderboardCard = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('investedReferralCount', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                
                const topUsers = querySnapshot.docs
                    .map(doc => doc.data() as LeaderboardUser)
                    .filter(user => user.investedReferralCount > 0); // Only show users with at least 1 referral

                setLeaderboard(topUsers);
            } catch (error) {
                console.error("Error fetching leaderboard: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <Card className="text-left">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-primary" />
                    <CardTitle>Weekly Referral Champions</CardTitle>
                </div>
                <CardDescription>Top 5 users with the most invested referrals.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : leaderboard.length > 0 ? (
                        leaderboard.map((user, index) => (
                            <div
                                key={index}
                                className={cn("flex items-center gap-4 p-3 rounded-lg border-2", getRankColor(index))}
                            >
                                {getRankIcon(index)}
                                <Avatar>
                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.investedReferralCount} Referrals</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <p>The competition is just getting started!</p>
                            <p className="text-sm">Be the first to appear on the leaderboard.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
```

---

### File: `src/components/vaultboost/referral-milestones-card.tsx`

```tsx
'use client';
import { FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const milestones: { [key: number]: number } = {
  5: 250,
  10: 500,
  20: 1000,
  30: 1500,
  40: 2000,
  50: 2500,
};

interface ReferralMilestonesCardProps {
    successfullyInvested: number;
}

export const ReferralMilestonesCard: FC<ReferralMilestonesCardProps> = ({ successfullyInvested }) => {
    const { userData } = useAuth();
    const claimedMilestones = userData?.claimedMilestones || [];

    const nextMilestone = useMemo(() => {
        const unclaimed = Object.keys(milestones).map(Number).filter(m => !claimedMilestones.includes(m));
        return unclaimed.length > 0 ? Math.min(...unclaimed) : null;
    }, [claimedMilestones]);

    const progressPercent = useMemo(() => {
        if (nextMilestone === null) return 100;
        return (successfullyInvested / nextMilestone) * 100;
    }, [successfullyInvested, nextMilestone]);


  return (
    <Card className="shadow-md text-left">
        <CardHeader>
            <div className='flex items-center gap-3'>
                 <Trophy className="w-6 h-6 text-primary" />
                <CardTitle>Referral Milestones</CardTitle>
            </div>
            <CardDescription>
                Earn extra bonuses for inviting friends who invest.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {nextMilestone !== null ? (
                <div className='space-y-2'>
                    <p className="text-sm font-semibold">Next Reward: <span className="text-primary">{milestones[nextMilestone]} Rs.</span> for {nextMilestone} referrals</p>
                    <Progress value={progressPercent} />
                    <p className="text-xs text-muted-foreground text-right">{successfullyInvested} / {nextMilestone} invested referrals</p>
                </div>
            ) : (
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                    <p className="font-semibold text-green-600">Congratulations! You've completed all milestones!</p>
                </div>
            )}


            <div className="space-y-3">
                {Object.entries(milestones).map(([target, reward]) => {
                    const isClaimed = claimedMilestones.includes(Number(target));
                    return (
                        <div key={target} className={cn("flex items-center justify-between p-3 rounded-lg", isClaimed ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50")}>
                            <div className="flex items-center gap-3">
                                {isClaimed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Trophy className="w-5 h-5 text-muted-foreground" />}
                                <div>
                                    <p className={cn("font-semibold", isClaimed && "text-green-600")}>Refer {target} Users</p>
                                    <p className="text-xs text-muted-foreground">Reward: {reward} Rs.</p>
                                </div>
                            </div>
                            {isClaimed && <span className="text-xs font-bold text-green-500">CLAIMED</span>}
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/transaction-history-card.tsx`

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Gift, TrendingUp, Banknote, ArrowUpCircle, ArrowDownCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

type TransactionType = 'bonus' | 'investment' | 'earning' | 'withdrawal' | 'referral';

interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    status: 'Completed' | 'Pending' | 'Rejected';
    date: Date;
}

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
        case 'referral':
             return <Users className="h-5 w-5 text-muted-foreground" />;
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
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    const transactionsColRef = collection(db, `users/${user.uid}/transactions`);
    const q = query(transactionsColRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedTransactions: Transaction[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: (data.date as Timestamp)?.toDate(),
            } as Transaction;
        });
        setTransactions(fetchedTransactions);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching transactions: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);


  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  );

  const filters: ('all' | TransactionType)[] = ['all', 'investment', 'earning', 'bonus', 'referral', 'withdrawal'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent financial activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
                 <Button 
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="capitalize"
                 >
                    {f}
                 </Button>
            ))}
        </div>
        <div className="space-y-2">
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded-full">
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                                <p className="font-semibold">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    {transaction.date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(transaction.date) : '...'}
                                </p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className={cn("font-bold", transaction.type === 'withdrawal' ? 'text-red-500' : 'text-green-500')}>
                                {transaction.type === 'withdrawal' ? '-' : '+'}{transaction.amount.toFixed(2)} Rs.
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
                ))
            ) : (
                 <div className="text-center py-8 text-muted-foreground">
                    No transactions of this type.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### File: `src/components/vaultboost/upgrade-card.tsx`

```tsx
'use client';
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

interface UpgradeCardProps {
    userName?: string;
}

export const UpgradeCard: FC<UpgradeCardProps> = ({ userName: propUserName }) => {
    const { userData } = useAuth();
    const userName = propUserName || userData?.name || 'User';
    const message = `Hi, I'm ${userName} and I want to upgrade to the PRO plan for 99 Rs.`;
    const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  return (
    <Card className="shadow-md border border-accent bg-accent/5">
        <CardHeader>
            <CardTitle className="text-accent text-lg">Upgrade to PRO Plan</CardTitle>
            <CardDescription>
                Increase your daily earnings to 13%!
            </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm">Basic Plan:</p>
                <p className="text-sm font-semibold">10% daily returns</p>
            </div>
            <div className="flex justify-between items-center text-accent">
                <p className="text-sm font-semibold">PRO Plan:</p>
                <p className="text-sm font-bold">13% daily returns</p>
            </div>
            <Link href={whatsappUrl} className='w-full' target='_blank'>
                <Button className="w-full" size="lg">Upgrade for 99 Rs.</Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

### File: `src/components/vaultboost/welcome-card.tsx`

```tsx
'use client';
import type { FC } from 'react';
import { Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface WelcomeCardProps {
  name: string;
  membership: string;
}

export const WelcomeCard: FC<WelcomeCardProps> = ({ name, membership }) => {
  const { userData } = useAuth();
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-400 p-6 text-black shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-3">
          <Crown className="h-8 w-8 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
          <p className="text-sm opacity-90 flex items-center gap-2">
            <span>{membership}</span>
            {userData?.rank && (
                <>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold">
                    <ShieldCheck className='w-4 h-4'/> {userData.rank} Rank
                </span>
                </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

### File: `src/components/vaultboost/withdraw-card.tsx`

```tsx
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Banknote, ShieldCheck, Info, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { addDoc, collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function WithdrawCard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [showInvestmentNeededDialog, setShowInvestmentNeededDialog] = useState(false);
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  

  const handleRequestWithdrawal = () => {
    // This check is a bit redundant now but good for UX
    if (!userData?.hasInvested) {
        setShowInvestmentNeededDialog(true);
        return;
    }
    setShowWithdrawForm(true);
  };

  const hasInvested = userData?.hasInvested || false;
  const canWithdraw = (userData?.totalBalance || 0) >= 100;
  const balance = userData?.totalBalance || 0;

  const handleSubmit = async () => {
     if (!user || !userData) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not found.' });
      return;
    }
    if (!hasInvested) {
      setShowInvestmentNeededDialog(true);
      return;
    }
    if (!canWithdraw) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: 'You need at least 100 Rs. in your balance to make a withdrawal.',
      });
      return;
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Minimum withdrawal amount is 100 Rs.' });
        return;
    }
     if (withdrawAmount > balance) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Withdrawal amount cannot exceed your available balance.' });
        return;
    }

    let details: any = {};
    if (method === 'upi') {
        if (!upiId) {
            toast({ variant: 'destructive', title: 'Missing Field', description: 'Please enter your UPI ID.' });
            return;
        }
        details.upiId = upiId;
    } else { // bank
         if (!accountNumber || !ifsc) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please enter all bank details.' });
            return;
        }
        details.accountHolder = userData.name;
        details.accountNumber = accountNumber;
        details.ifsc = ifsc;
    }
    
    setIsLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error("User document does not exist.");
        }

        const currentBalance = userDoc.data().totalBalance || 0;
        if (currentBalance < withdrawAmount) {
          throw new Error("Insufficient funds.");
        }

        // 1. Deduct from user's balance
        transaction.update(userDocRef, {
          totalBalance: currentBalance - withdrawAmount,
        });

        // 2. Create withdrawal request
        const withdrawalRef = doc(collection(db, `users/${user.uid}/withdrawals`));
        transaction.set(withdrawalRef, {
          amount: withdrawAmount,
          method: method === 'upi' ? 'UPI' : 'Bank Transfer',
          details,
          status: 'Pending',
          date: serverTimestamp(),
          userName: userData.name,
        });

         // 3. Create a transaction record
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        transaction.set(transactionRef, {
            type: 'withdrawal',
            amount: withdrawAmount,
            description: `Withdrawal request`,
            status: 'Pending',
            date: serverTimestamp(),
        });
      });

      toast({
        title: 'Request Submitted',
        description: 'Your withdrawal request has been submitted for processing.',
      });
      // Reset form
      setShowWithdrawForm(false);
      setAmount('');
      setUpiId('');
      setAccountNumber('');
      setIfsc('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Withdrawal Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
          <CardDescription>Available Balance: {userData?.totalBalance.toFixed(2) || '0.00'} Rs.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showWithdrawForm ? (
            <div className='space-y-4'>
              <Button className="w-full" onClick={handleRequestWithdrawal}>
                  <Banknote className="mr-2" /> Request Withdrawal
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
               <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                      Minimum withdrawal is 100 Rs. Your request will be processed within 24-48 hours.
                  </AlertDescription>
              </Alert>
               {userData?.name && (
                  <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400">
                      <ShieldCheck className="h-4 w-4 !text-green-500" />
                      <AlertTitle>Security Notice</AlertTitle>
                      <AlertDescription>
                          For your safety, withdrawals will only be processed to an account with the name: <span className='font-bold'>{userData.name}</span>.
                      </AlertDescription>
                  </Alert>
              )}
               <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Withdraw</Label>
                  <Input id="amount" type="number" placeholder="e.g., 150" value={amount} onChange={e => setAmount(e.target.value)} disabled={isLoading}/>
                </div>
              <RadioGroup value={method} onValueChange={(value: 'upi' | 'bank') => setMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
              </RadioGroup>

              {method === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="yourname@bank" value={upiId} onChange={e => setUpiId(e.target.value)} disabled={isLoading} />
                </div>
              )}

              {method === 'bank' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-holder">Account Holder Name</Label>
                    <Input id="account-holder" value={userData?.name} disabled readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="1234567890" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input id="ifsc-code" placeholder="BANK0001234" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} disabled={isLoading}/>
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showInvestmentNeededDialog} onOpenChange={setShowInvestmentNeededDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <div className="flex justify-center mb-4">
               <div className="p-3 bg-primary/10 rounded-full">
                  <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Investment Required</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              To ensure the security and sustainability of our platform, withdrawals are enabled only after you make your first investment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Link href="/investment" className='w-full'>
                <Button className='w-full'>
                    Make an Investment
                </Button>
            </Link>
            <AlertDialogAction onClick={() => setShowInvestmentNeededDialog(false)} variant="outline">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---

### File: `src/contexts/auth-context.tsx`

```tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { 
    User, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, writeBatch, collection, query, where, getDocs, updateDoc, Timestamp, runTransaction, arrayUnion, addDoc, increment } from 'firebase/firestore';

export interface Investment {
    id: string;
    planAmount: number;
    dailyReturn: number;
    startDate: Timestamp;
    lastUpdate: Timestamp;
    durationDays: number;
    earnings: number;
    status: 'active' | 'completed';
}

interface UserData {
    uid: string;
    name: string;
    email: string;
    phone: string;
    referralCode?: string;
    usedReferralCode?: string;
    referredBy?: string;
    commissionParent?: string; // UID of the user who gets commission
    investedReferralCount: number;
    referrals?: any[]; // Array of referred user objects
    membership: 'Basic' | 'Pro';
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBalance: number;
    totalInvested: number; // Sum of all planAmounts
    totalEarnings: number; // Sum of all earnings types
    totalReferralEarnings: number;
    totalBonusEarnings: number;
    totalInvestmentEarnings: number; // Sum of earnings from all investment plans

    hasInvested: boolean;
    hasCollectedSignupBonus: boolean;
    lastBonusClaim?: Timestamp;
    claimedMilestones?: number[];
    redeemedOfferCodes?: string[];
    createdAt: any;
    lastLogin: any;
    investments?: Investment[];
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  totalROI: number;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (details: any) => Promise<void>;
  signInWithEmail: (details: any) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  collectSignupBonus: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const totalROI = useMemo(() => {
        if (!userData || !userData.investments) return 0;
        const totalInvestedInActivePlans = userData.investments
            .filter(inv => inv.status === 'active')
            .reduce((acc, inv) => acc + inv.planAmount, 0);
        return totalInvestedInActivePlans * 3; // 300% ROI
    }, [userData]);


    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            sessionStorage.removeItem('vaultboost-announcement-seen');
        } catch (error) {
            console.error("Error signing out: ", error);
        } finally {
            setUser(null);
            setUserData(null);
            setIsAdmin(false);
            router.push('/login');
            setLoading(false); // Ensure loading is false after redirect
        }
    };

    // Function to process earnings for all active investments for a user
    const processInvestmentEarnings = async (currentUserId: string) => {
        const investmentsColRef = collection(db, `users/${currentUserId}/investments`);
        const activeInvestmentsQuery = query(investmentsColRef, where('status', '==', 'active'));
        
        try {
            // First, get all active investments outside of a transaction.
            const activeInvestmentsSnapshot = await getDocs(activeInvestmentsQuery);

            if (activeInvestmentsSnapshot.empty) {
                return; // No active investments to process
            }

            // Now, run a transaction to update user and investment docs together.
             await runTransaction(db, async (transaction) => {
                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    console.warn("processInvestmentEarnings: User document not found.");
                    return;
                }
                
                let totalEarningsToAdd = 0;
                const currentData = userDoc.data() as UserData;
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                const commissionParentRef = currentData.commissionParent ? doc(db, 'users', currentData.commissionParent) : null;
                let commissionParentDoc: any = null;
                if(commissionParentRef){
                    commissionParentDoc = await transaction.get(commissionParentRef);
                }


                for (const investmentDoc of activeInvestmentsSnapshot.docs) {
                    // We must re-fetch inside the transaction to ensure we have the latest data
                    const currentInvestmentRef = doc(db, `users/${currentUserId}/investments`, investmentDoc.id);
                    const currentInvestmentDoc = await transaction.get(currentInvestmentRef);

                    if (!currentInvestmentDoc.exists()) continue;

                    const investment = currentInvestmentDoc.data() as Investment;

                    const lastUpdateDate = investment.lastUpdate.toDate();
                    const startOfLastUpdateDay = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate());
                    
                    const msInDay = 24 * 60 * 60 * 1000;
                    const daysPassed = Math.floor((startOfToday.getTime() - startOfLastUpdateDay.getTime()) / msInDay);
                    
                    if (daysPassed <= 0) continue;

                    const daysAlreadyProcessed = Math.round(investment.earnings / investment.dailyReturn);
                    const remainingDaysInPlan = investment.durationDays - daysAlreadyProcessed;
                    const daysToCredit = Math.min(daysPassed, remainingDaysInPlan);

                    if (daysToCredit > 0) {
                        const earningsForThisPlan = investment.dailyReturn * daysToCredit;
                        totalEarningsToAdd += earningsForThisPlan;

                        const newEarnings = investment.earnings + earningsForThisPlan;
                        const newStatus = (daysAlreadyProcessed + daysToCredit) >= investment.durationDays ? 'completed' : 'active';
                        
                        transaction.update(currentInvestmentRef, {
                            earnings: newEarnings,
                            lastUpdate: serverTimestamp(),
                            status: newStatus
                        });

                        for (let i = 0; i < daysToCredit; i++) {
                            const transactionRef = doc(collection(db, `users/${currentUserId}/transactions`));
                            const earningDay = new Date(startOfToday.getTime() - (daysPassed - i - 1) * msInDay);
                            transaction.set(transactionRef, {
                                type: 'earning',
                                amount: investment.dailyReturn,
                                description: `Earning from Plan ${investment.planAmount}`,
                                status: 'Completed',
                                date: Timestamp.fromDate(earningDay),
                            });
                        }

                        // Handle lifetime commission
                        if (commissionParentDoc && commissionParentDoc.exists()) {
                            const commissionAmount = earningsForThisPlan * 0.03;
                            const parentData = commissionParentDoc.data();
                            transaction.update(commissionParentRef!, {
                                totalBalance: (parentData.totalBalance || 0) + commissionAmount,
                                totalReferralEarnings: (parentData.totalReferralEarnings || 0) + commissionAmount,
                                totalEarnings: (parentData.totalEarnings || 0) + commissionAmount,
                            });
                            
                            const commissionTransactionRef = doc(collection(db, `users/${commissionParentRef!.id}/transactions`));
                            transaction.set(commissionTransactionRef, {
                                type: 'referral',
                                amount: commissionAmount,
                                description: `3% commission from ${currentData.name}`,
                                status: 'Completed',
                                date: serverTimestamp(),
                            });
                        }
                    }
                }

                if (totalEarningsToAdd > 0) {
                    transaction.update(userDocRef, {
                        totalInvestmentEarnings: (currentData.totalInvestmentEarnings || 0) + totalEarningsToAdd,
                        totalBalance: (currentData.totalBalance || 0) + totalEarningsToAdd,
                        totalEarnings: (currentData.totalEarnings || 0) + totalEarningsToAdd,
                    });
                }
            });
        } catch (error) {
             if (String(error).includes("document does not exist")) {
                console.warn("processInvestmentEarnings failed because user document doesn't exist. This is expected during signup race conditions.");
            } else {
                console.error("Error processing investment earnings: ", error);
            }
        }
    };


    useEffect(() => {
        let unsubFromUser: (() => void) | undefined;
        let unsubFromInvestments: (() => void) | undefined;
        let authTimeout: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            clearTimeout(authTimeout); 
            if (unsubFromUser) unsubFromUser();
            if (unsubFromInvestments) unsubFromInvestments();
            
            if (currentUser) {
                const idTokenResult = await currentUser.getIdTokenResult();
                const userIsAdmin = !!idTokenResult.claims.admin;
                
                setUser(currentUser);
                setIsAdmin(userIsAdmin);

                if (userIsAdmin) {
                     setUserData(null);
                     setLoading(false);
                } else {
                    // Process earnings ONCE before setting up listeners
                    await processInvestmentEarnings(currentUser.uid); 
                    
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    unsubFromUser = onSnapshot(userDocRef, (userDocSnap) => {
                        if (!userDocSnap.exists()) {
                            console.warn(`No Firestore document found for user ${currentUser.uid}. Waiting...`);
                            return;
                        }
                        
                        const baseUserData = { uid: userDocSnap.id, ...userDocSnap.data() } as UserData;
                        
                        // Now listen to investments subcollection
                        const investmentsColRef = collection(db, `users/${currentUser.uid}/investments`);
                        unsubFromInvestments = onSnapshot(investmentsColRef, (investmentsSnap) => {
                            const investments = investmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
                            setUserData({ ...baseUserData, investments });
                            setLoading(false);
                        }, (error) => {
                            console.error("Error fetching investments:", error);
                            setUserData(baseUserData); // Set base data even if investments fail
                            setLoading(false);
                        });

                    }, (error) => {
                        console.error("Error fetching user data:", error);
                        toast({ variant: 'destructive', title: "Permissions Error", description: "Could not load user profile. Logging out." });
                        logOut();
                    });
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        authTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Auth state change timed out. Forcing loading to false.");
                setLoading(false);
            }
        }, 10000); 

        return () => {
            if (unsubFromUser) unsubFromUser();
            if (unsubFromInvestments) unsubFromInvestments();
            unsubscribe();
            clearTimeout(authTimeout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

     useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/login' || pathname.startsWith('/ref/');
        const isAdminPage = pathname.startsWith('/admin');

        if (!user && !isAuthPage) {
            router.push('/login');
        } else if (user && isAuthPage) {
            router.push(isAdmin ? '/admin' : '/');
        } else if (user && !isAdmin && isAdminPage) {
             router.push('/');
        } else if (user && isAdmin && !isAdminPage) {
            router.push('/admin');
        }
    }, [user, isAdmin, loading, pathname, router]);

    const signInWithGoogle = async () => {
        // To be implemented if needed
    };

    const signUpWithEmail = async ({ name, email, phone, password, referralCode: providedCode }: any) => {
        setLoading(true);
        try {
            // Step 1: Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Step 2: Create User Doc
            const referralCode = `${name.split(' ')[0].toUpperCase().substring(0, 5)}${(Math.random() * 9000 + 1000).toFixed(0)}`;
            const userDocRef = doc(db, 'users', newUser.uid);

            const newUserDocData: any = {
                uid: newUser.uid,
                name,
                email,
                phone,
                membership: 'Basic',
                totalBalance: 0,
                totalInvested: 0,
                totalEarnings: 0,
                totalReferralEarnings: 0,
                totalBonusEarnings: 0,
                totalInvestmentEarnings: 0,
                hasInvested: false,
                hasCollectedSignupBonus: false,
                investedReferralCount: 0,
                referralCode: referralCode,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                claimedMilestones: [],
                redeemedOfferCodes: [],
            };

            const usedCode = localStorage.getItem('referralCode') || providedCode;
            if (usedCode) {
                const q = query(collection(db, 'users'), where('referralCode', '==', usedCode.toUpperCase()));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const referrerDoc = querySnapshot.docs[0];
                    newUserDocData.usedReferralCode = usedCode.toUpperCase();
                    newUserDocData.referredBy = referrerDoc.id;
                }
            }
             
            await setDoc(userDocRef, newUserDocData);


            // Step 3: If referral code was used, add to referrer's subcollection
            if (newUserDocData.referredBy) {
                const referrerId = newUserDocData.referredBy;
                 if (referrerId !== newUser.uid) {
                    const referrerSubCollectionRef = collection(db, `users/${referrerId}/referrals`);
                    await addDoc(referrerSubCollectionRef, {
                        userId: newUser.uid,
                        name: name,
                        email: email,
                        hasInvested: false,
                        joinedAt: Timestamp.now(),
                    });
                    localStorage.removeItem('referralCode');
                }
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign Up Failed',
                description: error.message,
            });
            setLoading(false);
        }
    };

    const signInWithEmail = async ({ email, password }: any) => {
        setLoading(true);
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', credential.user.uid);
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message,
            });
             setLoading(false);
        }
    };

    const sendPasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Password Reset Link Sent',
                description: `If an account with ${email} exists, a reset link has been sent.`,
            });
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        }
    };
    
    const updateUserName = async (name: string) => {
        if (!user) throw new Error("User not found");
        await updateDoc(doc(db, 'users', user.uid), { name });
    };

    const updateUserPhone = async (phone: string) => {
        if (!user) throw new Error("User not found");
        await updateDoc(doc(db, 'users', user.uid), { phone });
    };
    
    const claimDailyBonus = async (amount: number) => {
        if (!user || !userData) throw new Error("User not found");

        const now = Timestamp.now();
        if (userData.lastBonusClaim) {
            const fourHours = 4 * 60 * 60 * 1000;
            const lastClaimMillis = userData.lastBonusClaim.toMillis();
            if (now.toMillis() - lastClaimMillis < fourHours) {
                throw new Error("You have already claimed your bonus recently.");
            }
        }
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: userData.totalBalance + amount,
            totalBonusEarnings: userData.totalBonusEarnings + amount,
            totalEarnings: userData.totalEarnings + amount,
            lastBonusClaim: now
        });
        
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        batch.set(transactionRef, {
            type: 'bonus',
            amount: amount,
            description: 'Daily Bonus Claim',
            status: 'Completed',
            date: now
        });

        await batch.commit();
        toast({ title: 'Bonus Claimed!', description: `You received ${amount} Rs.` });
    };

    const collectSignupBonus = async () => {
        if (!user || !userData) throw new Error("User not found");
        if (userData.hasCollectedSignupBonus) throw new Error("Sign-up bonus already collected.");

        const signupBonusAmount = 200;
        
        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.uid);
        
        batch.update(userDocRef, {
            totalBalance: userData.totalBalance + signupBonusAmount,
            totalBonusEarnings: userData.totalBonusEarnings + signupBonusAmount,
            totalEarnings: userData.totalEarnings + signupBonusAmount,
            hasCollectedSignupBonus: true,
        });
        
        const transactionRef = doc(collection(db, `users/${user.uid}/transactions`));
        batch.set(transactionRef, {
            type: 'bonus',
            amount: signupBonusAmount,
            description: 'Sign-up Bonus',
            status: 'Completed',
            date: serverTimestamp()
        });

        await batch.commit();
        toast({ title: 'Bonus Collected!', description: `You received ${signupBonusAmount} Rs.` });
    }

    const value: AuthContextType = {
        user,
        userData,
        loading,
        isAdmin,
        totalROI,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        updateUserPhone,
        updateUserName,
        claimDailyBonus,
        collectSignupBonus,
        sendPasswordReset,
    };
    
    if (loading) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Gem className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
                    <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```

---

### File: `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

### File: `src/lib/clear-test-users.ts`

```ts
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This script should be run from the root of the project

async function clearTestUsers() {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('❌ Error: ADMIN_EMAIL not found in your .env file.');
    console.log('Please create a .env file in the root of your project and add ADMIN_EMAIL=your-admin-email@example.com');
    process.exit(1);
  }

  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
        console.error('❌ Error: serviceAccountKey.json not found in the root of your project.');
        console.log('Please download it from your Firebase project settings and place it in the root directory.');
        process.exit(1);
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    console.log('--- Starting User Cleanup ---');
    console.log(`Admin account to preserve: ${adminEmail}`);

    const firestore = admin.firestore();
    const auth = admin.auth();

    // 1. Get all users from Firestore
    console.log('\nFetching users from Firestore...');
    const firestoreUsersSnapshot = await firestore.collection('users').get();
    const firestoreUsers = firestoreUsersSnapshot.docs;
    console.log(`Found ${firestoreUsers.length} user documents in Firestore.`);

    let deletedFirestoreCount = 0;
    for (const userDoc of firestoreUsers) {
        const userData = userDoc.data();
        if (userData.email !== adminEmail) {
            console.log(`- Deleting Firestore doc for ${userData.email} (ID: ${userDoc.id})`);
            await userDoc.ref.delete();
            deletedFirestoreCount++;
        }
    }
    console.log(`✅ Deleted ${deletedFirestoreCount} Firestore user documents.`);

    // 2. Get all users from Firebase Auth
    console.log('\nFetching users from Firebase Authentication...');
    const listUsersResult = await auth.listUsers(1000); // Batches of 1000
    const authUsers = listUsersResult.users;
    console.log(`Found ${authUsers.length} users in Firebase Authentication.`);
    
    let deletedAuthCount = 0;
    for (const userRecord of authUsers) {
        if (userRecord.email !== adminEmail) {
            console.log(`- Deleting Auth account for ${userRecord.email} (UID: ${userRecord.uid})`);
            await auth.deleteUser(userRecord.uid);
            deletedAuthCount++;
        }
    }
    console.log(`✅ Deleted ${deletedAuthCount} Firebase Authentication accounts.`);

    console.log('\n--- Cleanup Complete ---');
    console.log('All test users have been removed from Firestore and Authentication.');


  } catch (error: any) {
    console.error('\n❌ An error occurred during cleanup:', error.message);
  } finally {
    process.exit(0);
  }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
  clearTestUsers();
}
```

---

### File: `src/lib/firebase.ts`

```ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "upi-boost-vault-f64fw",
  "appId": "1:1017948596718:web:b25de6f4ed5d179b5046ff",
  "storageBucket": "upi-boost-vault-f64fw.firebasestorage.app",
  "apiKey": "AIzaSyDLhmKP9BeoHGn_zz8UaVURix83lPfWSds",
  "authDomain": "upi-boost-vault-f64fw.firebaseapp.com",
  "measurementId": "G-C3ZQDSL5FM",
  "messagingSenderId": "1017948596718"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

---

### File: `src/lib/firebaseAdmin.ts`

```ts
import * as admin from 'firebase-admin';

// This function ensures that Firebase is initialized only once.
export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        // The SDK will automatically pick up credentials from the environment.
        // In a deployed environment, this is handled automatically.
        // In a local environment, it will look for the GOOGLE_APPLICATION_CREDENTIALS
        // environment variable pointing to the serviceAccountKey.json file.
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
      // We re-throw the error to make it clear that initialization failed.
      throw new Error('Failed to initialize Firebase Admin SDK. Check server logs for details.');
    }
  }

  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin,
  };
}
```

---

### File: `src/lib/set-admin-claim.ts`

```ts
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This script should be run from the root of the project

async function setAdminClaim() {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.error('❌ Error: ADMIN_EMAIL not found in your .env file.');
    console.log('Please create a .env file in the root of your project and add ADMIN_EMAIL=your-admin-email@example.com');
    process.exit(1);
  }

  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (!fs.existsSync(serviceAccountPath)) {
        console.error('❌ Error: serviceAccountKey.json not found in the root of your project.');
        console.log('Please download it from your Firebase project settings and place it in the root directory.');
        process.exit(1);
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    console.log(`⏳ Looking up user by email: ${adminEmail}...`);
    const user = await admin.auth().getUserByEmail(adminEmail);
    
    if (user.customClaims && (user.customClaims as any).admin === true) {
        console.log(`✅ User ${adminEmail} (UID: ${user.uid}) is already an admin.`);
        return;
    }

    console.log(`Found user. UID: ${user.uid}. Setting admin claim...`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Success! Admin claim has been set for ${adminEmail}.`);
    console.log('It may take a few minutes to propagate. Please log out and log back in to see the changes.');

  } catch (error: any) {
    console.error('❌ Error setting custom admin claim:', error.message);
    if (error.code === 'auth/user-not-found') {
        console.error(`No user found with the email: ${adminEmail}. Please make sure the user exists in Firebase Authentication.`);
    }
  } finally {
    process.exit(0);
  }
}

// This allows the script to be run directly from the command line
if (require.main === module) {
  setAdminClaim();
}
```

---

### File: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### File: `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['PT Sans', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'open-suitcase': {
          'from': { transform: 'rotateY(0deg)' },
          'to': { transform: 'rotateY(180deg)' },
        },
        'shake': {
           '0%, 100%': { transform: 'translateX(0)' },
           '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px) rotate(-2deg)' },
           '20%, 40%, 60%, 80%': { transform: 'translateX(5px) rotate(2deg)' },
        },
         'spin-y': {
            'from': { transform: 'rotateY(0deg)' },
            'to': { transform: 'rotateY(360deg)' },
        },
        'sparkle': {
            '0%, 100%': { opacity: '1', transform: 'scale(1)' },
            '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'open-suitcase': 'open-suitcase 1s ease-in-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'spin-y': 'spin-y 2s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }: { addUtilities: any}) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        }
      })
    }
  ],
} satisfies Config;
```

---

### File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

