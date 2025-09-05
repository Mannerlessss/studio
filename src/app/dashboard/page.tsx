'use client';
// This page is obsolete. The content has been moved to /app/page.tsx.
// This file can be deleted.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/');
    }, [router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
