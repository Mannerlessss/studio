
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, HandCoins, Gift, TrendingUp } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, collectionGroup, getDocs, query, where } from 'firebase/firestore';
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
                    const isExpiredByDate = offer.expiresAt && offer.expiresAt.toMillis() < Date.now();
                    const isExpiredByUsage = offer.maxUsers && offer.usageCount >= offer.maxUsers;
                    return !isExpiredByDate && !isExpiredByUsage;
                }).length;

                // Total Investments - Sum of 'invested' field from all users
                let totalInvestments = 0;
                usersSnapshot.forEach(doc => {
                    totalInvestments += doc.data().invested || 0;
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
