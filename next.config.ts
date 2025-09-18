import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';

let serviceAccountKey: string | undefined;

try {
  const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  if (fs.existsSync(keyPath)) {
    serviceAccountKey = fs.readFileSync(keyPath, 'utf8');
  }
} catch (error) {
  console.warn(`Could not load serviceAccountKey.json: ${error}`);
}


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  env: {
    FIREBASE_SERVICE_ACCOUNT_KEY: serviceAccountKey,
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyDLhmKP9BeoHGn_zz8UaVURix83lPfWSds",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "upi-boost-vault-f64fw.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "upi-boost-vault-f64fw",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "upi-boost-vault-f64fw.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "1017948596718",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:1017948596718:web:b25de6f4ed5d179b5046ff",
  }
};

export default nextConfig;
