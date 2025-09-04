
'use client';
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

const SupportPage: NextPage = () => {
  const email = 'gagansharma.gs107@gmail.com';
  const mailtoLink = `mailto:${email}`;

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
             <Link href={mailtoLink} className="w-full" target="_blank">
                <Button className="w-full" size='lg'>
                    <Mail className="mr-2" /> Contact Us
                </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <BottomNav activePage={'dashboard'} />
    </div>
  );
};

export default SupportPage;
