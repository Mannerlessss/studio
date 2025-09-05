
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockReferrers = [
  { rank: 1, name: 'Alex Gold', value: '125 Referrals', avatar: '/avatars/01.png' },
  { rank: 2, name: 'Ben Silver', value: '98 Referrals', avatar: '/avatars/02.png' },
  { rank: 3, name: 'Chloe Bronze', value: '72 Referrals', avatar: '/avatars/03.png' },
  { rank: 4, name: 'David Lee', value: '55 Referrals', avatar: '/avatars/04.png' },
  { rank: 5, name: 'Eva Chen', value: '43 Referrals', avatar: '/avatars/05.png' },
];

const mockInvestors = [
  { rank: 1, name: 'Fiona Invests', value: '50,000 Rs.', avatar: '/avatars/06.png' },
  { rank: 2, name: 'George Money', value: '35,000 Rs.', avatar: '/avatars/07.png' },
  { rank: 3, name: 'Hannah Stocks', value: '28,000 Rs.', avatar: '/avatars/08.png' },
  { rank: 4, name: 'Ian Capital', value: '21,000 Rs.', avatar: '/avatars/09.png' },
  { rank: 5, name: 'Jia Assets', value: '15,000 Rs.', avatar: '/avatars/10.png' },
];

const getMedalColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-500";
        case 2: return "text-slate-400";
        case 3: return "text-orange-600";
        default: return "text-muted-foreground";
    }
}

const LeaderboardList = ({ data }: { data: typeof mockReferrers }) => (
    <div className="space-y-4">
        {data.map((user) => (
             <div key={user.rank} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2 w-12">
                   <Medal className={cn("w-5 h-5", getMedalColor(user.rank))} />
                   <span className="font-bold">{user.rank}</span>
                </div>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.avatar}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                </div>
                <div className="font-semibold text-primary">{user.value}</div>
            </div>
        ))}
    </div>
)

export function LeaderboardCard() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="referrers">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
                    <TabsTrigger value="investors">Top Investors</TabsTrigger>
                </TabsList>
                <TabsContent value="referrers" className='mt-4'>
                   <LeaderboardList data={mockReferrers} />
                </TabsContent>
                <TabsContent value="investors" className='mt-4'>
                    <LeaderboardList data={mockInvestors as any} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}
