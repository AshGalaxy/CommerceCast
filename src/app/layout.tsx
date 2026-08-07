import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from 'next-themes';

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
      <head />
      <body
        className={cn('min-h-screen bg-background font-body antialiased', GeistSans.variable)}
      >
        {/*
          next-themes ThemeProvider:
          - attribute="class"   → toggles .dark / .light on <html>
          - defaultTheme="dark" → dark by default
          - enableSystem        → respects prefers-color-scheme on first visit
          - disableTransitionOnChange → avoids colour-flash during switch
          It injects a tiny blocking <script> before React hydrates, which
          eliminates FOUC and hydration mismatches entirely.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>{children}</FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
