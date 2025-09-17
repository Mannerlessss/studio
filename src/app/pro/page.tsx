'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ArrowUp, Star, Shield, Award } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const ComparisonCard = ({ title, returns, examples, isPro }: { title: string; returns: string; examples: {plan: number, daily: number}[], isPro?: boolean }) => (
    <Card className={cn("flex-1", isPro && "border-2 border-primary bg-primary/5")}>
        <CardHeader>
            <CardTitle className={cn("text-xl", isPro && "text-primary")}>{title}</CardTitle>
            {!isPro && <CardDescription>Current Plan</CardDescription>}
            {isPro && <Badge className="w-fit">Recommended</Badge>}
        </CardHeader>
        <CardContent className="space-y-3">
            <p className="text-4xl font-bold">{returns}<span className="text-xl font-medium text-muted-foreground"> Daily</span></p>
            <div className="text-xs text-muted-foreground space-y-1 pt-2">
                {examples.map(ex => (
                    <p key={ex.plan}>• {ex.plan.toLocaleString()} Rs. Plan Daily: <span className="font-semibold text-foreground">{ex.daily.toLocaleString()} Rs.</span></p>
                ))}
            </div>
        </CardContent>
    </Card>
);

const ReturnComparisonRow = ({ investment, basic, pro }: { investment: number, basic: number, pro: number }) => (
    <div className="flex items-center space-x-2">
        <div className="p-3 rounded-lg bg-muted flex-1 text-center">
            <p className="text-sm text-muted-foreground">{investment.toLocaleString()} Rs. Investment</p>
            <p className="text-xs text-muted-foreground">(30 Days)</p>
        </div>
        <div className="flex-1 space-y-1 text-center">
            <p className="text-sm font-semibold">{pro.toLocaleString()} Rs.</p>
            <p className="text-xs text-muted-foreground line-through">{basic.toLocaleString()} Rs.</p>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">+{(pro - basic).toLocaleString()} Rs. Extra</Badge>
        </div>
    </div>
);


const ProPage: NextPage = () => {
  const { userData } = useAuth();
  const userName = userData?.name || 'User';
  const message = `Hi, I'm ${userName} and I want to upgrade to the PRO plan for 99 Rs.`;
  const whatsappUrl = `https://wa.me/7888540806?text=${encodeURIComponent(message)}`;

  const benefits = [
    { icon: ArrowUp, title: "Higher Daily Returns", description: "Increase all your investment returns from 10% to 13% daily." },
    { icon: Star, title: "Enhanced Daily Bonus", description: "Get higher bonus rewards in daily bonus games (₹3-₹8)." },
    { icon: Shield, title: "Priority Support", description: "Get faster response times and dedicated PRO support." },
    { icon: Award, title: "Early Access", description: "Access to new investment plans and features before others." },
  ];

  const returns = [
      { investment: 100, basic: 100 + (100 * 0.10 * 30), pro: 100 + (100 * 0.13 * 30) },
      { investment: 300, basic: 300 + (300 * 0.10 * 30), pro: 300 + (300 * 0.13 * 30) },
      { investment: 500, basic: 500 + (500 * 0.10 * 30), pro: 500 + (500 * 0.13 * 30) },
      { investment: 1000, basic: 1000 + (1000 * 0.10 * 30), pro: 1000 + (1000 * 0.13 * 30) },
      { investment: 2000, basic: 2000 + (2000 * 0.10 * 30), pro: 2000 + (2000 * 0.13 * 30) },
  ];

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-8">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Upgrade to PRO</h1>
            <p className="text-muted-foreground">Unlock premium features and higher returns.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <ComparisonCard title="Basic Plan" returns="10%" examples={[{plan: 100, daily: 10}, {plan: 500, daily: 50}, {plan: 1000, daily: 100}]} />
            <ComparisonCard title="PRO Plan" returns="13%" examples={[{plan: 100, daily: 13}, {plan: 500, daily: 65}, {plan: 1000, daily: 130}]} isPro />
        </div>

        <Card className="bg-gradient-to-tr from-primary/10 to-card">
            <CardContent className="p-6 text-center space-y-4">
                <div>
                    <p className="text-muted-foreground">One-Time Upgrade Fee</p>
                    <p className="text-5xl font-bold">99 <span className="text-2xl">Rs.</span></p>
                    <p className="font-semibold text-primary">Lifetime PRO membership</p>
                </div>
                <Link href={whatsappUrl} className='w-full' target='_blank'>
                    <Button className="w-full" size="lg">
                        <Zap className="mr-2" /> Upgrade to PRO Now
                    </Button>
                </Link>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>PRO Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 {benefits.map(benefit => (
                    <div key={benefit.title} className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-full mt-1">
                            <benefit.icon className="w-5 h-5 text-primary"/>
                        </div>
                        <div>
                            <p className="font-semibold">{benefit.title}</p>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle>PRO vs Basic Returns</CardTitle>
                <CardDescription>30-day investment comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {returns.map(r => (
                    <ReturnComparisonRow key={r.investment} {...r} />
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>What PRO Members Say</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm italic">"Upgraded to PRO and my daily earnings increased by 30%! Worth every penny."</p>
                        <p className="text-xs font-semibold mt-1">- Ravi K., PRO Member</p>
                    </div>
                </div>
                 <div className="flex gap-4">
                    <Avatar>
                        <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm italic">"The higher daily bonus and priority support make PRO membership amazing."</p>
                        <p className="text-xs font-semibold mt-1">- Priya S., PRO Member</p>
                    </div>
                </div>
                 <div className="flex gap-4">
                    <Avatar>
                        <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm italic">"Best investment I made was upgrading to PRO. Returns are consistently higher."</p>
                        <p className="text-xs font-semibold mt-1">- Amit T., PRO Member</p>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
      <BottomNav activePage="pro" />
    </div>
  );
};

export default ProPage;
