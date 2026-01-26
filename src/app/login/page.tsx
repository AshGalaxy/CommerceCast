'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import Link from 'next/link';

import { useAuthRedirect } from '@/hooks/use-redirect';

function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useAuthRedirect(user, isUserLoading, '/dashboard');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      if (!email || !password) {
        toast({
          variant: 'destructive',
          title: 'Missing fields',
          description: 'Please enter both email and password.',
        });
        return;
      }

      try {
        toast({
          title: 'Signing In...',
          description: 'Please wait while we sign you in.',
        });
        await initiateEmailSignIn(auth, email, password);
        // Success is handled by useAuthRedirect or onAuthStateChanged
      } catch (error: any) {
        console.warn("Login error:", error);
        let errorMessage = "An unexpected error occurred.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = "Too many failed attempts. Please try again later.";
        }

        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: errorMessage,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Firebase Auth service is not available.',
      });
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8 flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100 font-headline">
            CommerceCast
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
