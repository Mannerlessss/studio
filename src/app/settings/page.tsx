
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Gift, Shield, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SettingsPage: NextPage = () => {
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
                <Input id="full-name" defaultValue="Nikhil" />
                <Button>Update</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phone-number" placeholder="Enter your phone number" />
                <Button>Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-accent" />
              <CardTitle>Offer Code</CardTitle>
            </div>
            <CardDescription>Enter offer codes to get bonus rewards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="offer-code">Offer Code</Label>
              <div className="flex gap-2">
                <Input id="offer-code" placeholder="WELCOME50" />
                <Button variant="secondary">Redeem</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Follow our social media for daily offer codes and exclusive rewards!</p>
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
                    <p className="font-semibold">nikhil@example.com</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
            </div>
            <div className="flex justify-between items-center">
                 <div>
                    <p className="text-sm text-muted-foreground">Referral Code</p>
                    <p className="font-semibold">REF69FE72</p>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full">
            <LogOut className="mr-2" />
            Logout
        </Button>

      </div>
      <BottomNav activePage="settings" />
    </div>
  );
};

export default SettingsPage;
