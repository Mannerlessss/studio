
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, User, Lock, LogOut } from 'lucide-react';


const SettingsPage: NextPage = () => {

    const settingsOptions = [
        { label: 'Account Information', icon: User },
        { label: 'Change Password', icon: Lock },
    ]

  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                {settingsOptions.map((option) => (
                    <Button variant="ghost" className="w-full justify-between" key={option.label}>
                        <div className='flex items-center gap-3'>
                            <option.icon className="w-5 h-5 text-muted-foreground" />
                            <span>{option.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Button>
                ))}
            </CardContent>
        </Card>
        <Button variant="destructive" className="w-full">
            <LogOut className="mr-2"/>
            Logout
        </Button>

      </div>
      <BottomNav activePage="settings" />
    </div>
  );
};

export default SettingsPage;
