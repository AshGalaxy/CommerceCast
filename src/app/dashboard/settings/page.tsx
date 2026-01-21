'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/contexts/theme-context';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
    const { toast } = useToast();
    const auth = useAuth();
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    const [loginRedirectPref, setLoginRedirectPref] = useLocalStorage<string>('login-redirect-preference', 'dashboard');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleToggle = (checked: boolean) => {
        const newValue = checked ? 'data-sources' : 'dashboard';
        setLoginRedirectPref(newValue);
        toast({
            title: 'Setting Updated',
            description: `Login redirection set to ${newValue === 'dashboard' ? 'Dashboard' : 'Data Sources'}.`,
        });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !auth?.currentUser || !user.email) {
            toast({ variant: 'destructive', title: 'Not authenticated or email missing.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Password must be at least 6 characters.' });
            return;
        }

        setIsChangingPassword(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);

            toast({ title: 'Password Updated', description: 'Your password has been changed successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error: any) {
            console.error("Password change error:", error);
            let description = 'An unexpected error occurred.';
            if (error.code === 'auth/wrong-password') {
                description = 'The current password you entered is incorrect. Please try again.';
            } else if (error.code === 'auth/too-many-requests') {
                description = 'Too many attempts. Please try again later.';
            }
            toast({
                variant: 'destructive',
                title: 'Password Change Failed',
                description: description,
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Authenticated' });
            return;
        }

        try {
            await deleteUser(user);
            toast({
                title: 'Account Deleted',
                description: 'Your account has been permanently deleted.',
            });
        } catch (error) {
            console.error('Account deletion error:', error);
            toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: 'There was an error deleting your account. Please log out and log back in to try again.',
            });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold md:text-3xl font-headline">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance & Preferences</CardTitle>
                    <CardDescription>Customize how the application looks and behaves.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="theme-toggle" className="font-medium">Dark Mode</Label>
                            <span className="text-sm text-muted-foreground">
                                Switch between light and dark themes.
                            </span>
                        </div>
                        <Switch
                            id="theme-toggle"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>



                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="login-redirect" className="font-medium">Redirect to Data Sources on Login</Label>
                            <span className="text-sm text-muted-foreground">
                                When enabled, you will be redirected to the Data Sources page instead of the Dashboard after logging in.
                            </span>
                        </div>
                        <Switch
                            id="login-redirect"
                            checked={loginRedirectPref === 'data-sources'}
                            onCheckedChange={handleToggle}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        For your security, we recommend using a strong password that you
                        don't use anywhere else.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        These actions are irreversible. Please be certain before proceeding.
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex justify-between items-center'>
                    <p className="text-sm">
                        Permanently delete your account and all associated data.
                    </p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount}>
                                    Yes, delete account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
