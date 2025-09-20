
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VaultBoost',
  description: 'Boost your investments with VaultBoost.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script>
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                  console.log('Service Worker registered with scope:', registration.scope);
                }).catch(error => {
                  console.log('Service Worker registration failed:', error);
                });
              });
            }
          `}
        </script>
      </head>
      <body className="font-body antialiased h-full bg-background">
        <AuthProvider>
            <div className="relative flex flex-col h-full">
              <main className="flex-grow pb-28">{children}</main>
               <footer className="p-4 text-center text-xs text-muted-foreground space-y-2">
                    <p>This is a risk-based investment product. Please invest at your own discretion.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/terms" className="underline">Terms & Conditions</Link>
                        <Link href="/privacy" className="underline">Privacy Policy</Link>
                    </div>
              </footer>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
