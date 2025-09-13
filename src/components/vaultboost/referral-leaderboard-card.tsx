
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
