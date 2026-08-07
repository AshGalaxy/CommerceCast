'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { useEffect, useState, Suspense } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthRedirect } from '@/hooks/use-redirect';

function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        await initiateEmailSignIn(auth, email, password);
        // Success is handled by useAuthRedirect
      } catch (error: any) {
        setIsLoading(false);
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <Link href="/" className="absolute left-8 top-8 hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-10">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <Logo className="h-16 w-16 text-primary drop-shadow-lg" />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight font-headline">
            Welcome back
          </h1>
          <p className="text-muted-foreground font-medium">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
          <CardContent className="p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 dark:bg-black/50"
                  required
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Password</Label>
                  <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 dark:bg-black/50"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-9 text-[13px] rounded-lg font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
