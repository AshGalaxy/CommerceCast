
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
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import Link from 'next/link';

import { useAuthRedirect } from '@/hooks/use-redirect';

function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useAuthRedirect(user, isUserLoading, '/dashboard/profile?onboarding=true');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password Validation
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      toast({
        variant: 'destructive',
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long and contain at least one number and one special character.',
      });
      return;
    }

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
          title: 'Creating Account...',
          description: 'Please wait while we create your account.',
        });
        await initiateEmailSignUp(auth, email, password);
        // Success handled by redirect hook
      } catch (error: any) {
        console.warn("Signup error:", error);
        let errorMessage = "An unexpected error occurred.";
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Please sign in instead.";
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = "Please enter a valid email address.";
        } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password is too weak.";
        }

        toast({
          variant: 'destructive',
          title: 'Signup Failed',
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
            Create an Account
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Get started with CommerceCast.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSignUp} className="space-y-4">
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
                  minLength={8}
                />
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1 mt-2">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                  <li className={/\d/.test(password) ? 'text-green-600' : ''}>At least one number</li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>At least one special character</li>
                </ul>
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

