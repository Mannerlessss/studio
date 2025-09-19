
import type { NextPage } from 'next';
import { Header } from '@/components/vaultboost/header';
import { BottomNav } from '@/components/vaultboost/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PrivacyPage: NextPage = () => {
  return (
    <div className="bg-background min-h-full">
      <Header />
      <div className="p-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <CardDescription>Last updated: October 2024</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert">
                <p>Your privacy is important to us. It is VaultBoost's policy to respect your privacy regarding any information we may collect from you across our app.</p>

                <h2>1. Information We Collect</h2>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and provide the features and functionality of the app, to analyze how the service is used, diagnose service or technical problems, maintain security, and personalize content.</p>

                <h2>3. Data Security</h2>
                <p>We are committed to protecting the security of your personal information. We use a variety of security technologies and procedures to help protect your personal information from unauthorized access, use, or disclosure.</p>

                <h2>4. Your Consent</h2>
                <p>By using our app, you hereby consent to our Privacy Policy and agree to its terms.</p>
                
            </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default PrivacyPage;
