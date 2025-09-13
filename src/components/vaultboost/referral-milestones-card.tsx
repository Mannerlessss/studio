
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
