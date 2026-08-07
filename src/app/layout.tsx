import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/contexts/theme-context';

export const metadata: Metadata = {
  title: 'CommerceCast',
  description: 'AI-powered analytics and forecasting for e-commerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>

      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased', GeistSans.variable)}
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <FirebaseClientProvider>{children}</FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
