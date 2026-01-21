'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

function ProfileContent() {
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const syncStateFromUser = useCallback(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setAvatarUrl(user.photoURL);
    } else if (!isUserLoading) {
      setDisplayName('');
      setAvatarUrl(null);
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    syncStateFromUser();
  }, [syncStateFromUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth?.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
      });
    } finally {
      setIsUpdating(false);

      const isOnboarding = searchParams.get('onboarding') === 'true';

      if (isOnboarding && window.localStorage) {
        window.localStorage.setItem('start-tour', 'true');
      }
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !auth?.currentUser) return;
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { photoURL: '' });
      setAvatarUrl(null);
      toast({
        title: 'Avatar Removed',
        description: 'Your profile picture has been removed.',
      });
    } catch (error) {
      console.error('Avatar removal error:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was an error removing your avatar.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getAvatarFallback = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold md:text-3xl font-headline">
        Business Profile
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Manage your business information and personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarUrl || ''}
                  alt="User Avatar"
                />
                <AvatarFallback>{getAvatarFallback(displayName)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">
                Change Avatar
              </Button>
              <Button variant="ghost" type="button" onClick={handleRemoveAvatar} disabled={isUpdating}>
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Owner Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="e.g., Acme Innovations" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <Input
                  id="company-website"
                  placeholder="e.g., https://acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-industry">Business Industry</Label>
                <Select>
                  <SelectTrigger id="business-industry">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="e.g., India" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="vat-gst">VAT/GST Number</Label>
                <Input id="vat-gst" placeholder="e.g., 22AAAAA0000A1Z5" />
              </div>
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
