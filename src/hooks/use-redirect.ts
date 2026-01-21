
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(user: any, isLoading: boolean, defaultPath: string = '/dashboard') {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!isLoading && user) {
            // 1. Check for 'redirect' query parameter
            const redirectParam = searchParams.get('redirect');
            if (redirectParam) {
                router.push(redirectParam);
                return;
            }

            // 2. Check for localStorage preference
            const redirectPref = window.localStorage.getItem('login-redirect-preference');
            if (redirectPref) {
                // Handle specific keywords if needed, or assume it's a path
                if (redirectPref === 'data-sources') {
                    router.push('/dashboard/data-sources');
                    return;
                }
                // If it starts with /, assume it's a path
                if (redirectPref.startsWith('/')) {
                    router.push(redirectPref);
                    return;
                }
            }

            // 3. Fallback to default path
            router.push(defaultPath);
        }
    }, [user, isLoading, router, searchParams, defaultPath]);
}
