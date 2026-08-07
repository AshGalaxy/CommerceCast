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
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthRedirect } from '@/hooks/use-redirect';

function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        await initiateEmailSignUp(auth, email, password);
        // Success handled by redirect hook
      } catch (error: any) {
        setIsLoading(false);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_8px_32px_rgba(59,130,246,0.15)] ring-1 ring-white/10">
            <Logo className="h-8 w-8 text-primary drop-shadow-md" />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight font-headline">
            Create an Account
          </h1>
          <p className="text-muted-foreground font-medium">
            Get started with CommerceCast today.
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
          <CardContent className="p-8">
            <form onSubmit={handleSignUp} className="space-y-6">
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
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Password</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 dark:bg-black/50"
                  required
                  minLength={8}
                />
                
                {password.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden pt-2"
                  >
                    <ul className="text-xs space-y-2 rounded-lg bg-muted/50 p-3 border border-border/50">
                      <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600 dark:text-green-500 font-semibold' : 'text-muted-foreground'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        At least 8 characters
                      </li>
                      <li className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-600 dark:text-green-500 font-semibold' : 'text-muted-foreground'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        At least one number
                      </li>
                      <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 dark:text-green-500 font-semibold' : 'text-muted-foreground'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        At least one special character
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
