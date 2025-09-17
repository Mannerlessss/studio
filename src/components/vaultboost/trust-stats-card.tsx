'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, HandCoins, Gift, Shield } from 'lucide-react';
import { getPublicStats, PublicStats } from '@/ai/flows/get-public-stats-flow';
import { useToast } from '@/hooks/use-toast';

const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
        <div className="text-primary">
            {icon}
        </div>
        <div>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    </div>
);

export function TrustStatsCard() {
    const [stats, setStats] = useState<PublicStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getPublicStats();
                setStats(result);
            } catch (error: any) {
                console.error("Failed to fetch public stats:", error);
                toast({
                    variant: 'destructive',
                    title: 'Could not load stats',
                    description: error.message
                });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [toast]);

    const formatNumber = (num: number) => {
        if (num > 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toLocaleString('en-IN');
    };

    const formatCurrency = (num: number) => {
         if (num >= 10000000) { // Crores
            return `${(num / 10000000).toFixed(2)} Cr Rs.`;
        }
        if (num >= 100000) { // Lakhs
            return `${(num / 100000).toFixed(2)} L Rs.`;
        }
        return `${num.toLocaleString('en-IN')} Rs.`;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <CardTitle>Trust Center</CardTitle>
                </div>
                <CardDescription>Real-time platform statistics.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-2 gap-4">
                        <StatItem icon={<Users className="w-6 h-6" />} value={formatNumber(stats.totalUsers)} label="Total Users" />
                        <StatItem icon={<TrendingUp className="w-6 h-6" />} value={formatCurrency(stats.totalInvestments)} label="Total Invested" />
                        <StatItem icon={<HandCoins className="w-6 h-6" />} value={formatCurrency(stats.totalWithdrawals)} label="Total Withdrawn" />
                        <StatItem icon={<Gift className="w-6 h-6" />} value={formatCurrency(stats.totalBonuses)} label="Total Bonuses Paid" />
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        Could not load statistics.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
