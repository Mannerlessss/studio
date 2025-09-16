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
  }
};

export default nextConfig;
