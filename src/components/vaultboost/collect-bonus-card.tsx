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
