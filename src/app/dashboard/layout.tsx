
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import DashboardLayout from '@/components/dashboard-layout';
import { TourGuide } from '@/components/dashboard/tour-guide';
import { GoogleSheetAutoSync } from '@/components/GoogleSheetAutoSync';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the initial auth check is done and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // While loading, or if there is a user, show the dashboard layout.
  // A loading spinner could be added here for a better UX.
  if (isUserLoading || !user) {
    // You can return a loading spinner here, or null
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <GoogleSheetAutoSync />
      {children}
      <TourGuide />
    </DashboardLayout>
  );
}
