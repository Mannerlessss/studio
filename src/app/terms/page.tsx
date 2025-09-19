
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const TermsPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Last updated: October 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert">
                <p>Welcome to VaultBoost. These terms and conditions outline the rules and regulations for the use of our application.</p>

                <h2>1. Introduction</h2>
                <p>By accessing this app, we assume you accept these terms and conditions. Do not continue to use VaultBoost if you do not agree to all of the terms and conditions stated on this page.</p>

                <h2>2. Investments & Returns</h2>
                <p>All investments made through VaultBoost are subject to market risks. The returns are not guaranteed and may vary. We are not liable for any financial losses incurred.</p>

                <h2>3. User Account</h2>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                <h2>4. Prohibited Activities</h2>
                <p>You are prohibited from using the service for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international, federal, or state regulations, rules, laws, or local ordinances.</p>
                
                <h2>5. Changes to Terms</h2>
                <p>We reserve the right to revise these terms at any time. By using this app, you are expected to review these terms on a regular basis.</p>
            </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default TermsPage;
