'use client';

import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { getGoogleSheet } from '@/ai/flows/google-sheets-flow';
import { useToast } from '@/hooks/use-toast';

type SalesDataHistoryItem = {
    fileName: string;
    uploadDate: string;
    size: number;
    recordCount: number;
    data: string;
};

type SalesDataStorage = {
    currentData: string;
    history: SalesDataHistoryItem[];
};

type GoogleAuthStorage = {
    accessToken: string | null;
}

type SyncConfig = {
    interval: number; // in minutes, 0 = manual
    lastSynced: string | null; // ISO date
    sheetId: string;
    sheetName: string;
};

export function GoogleSheetAutoSync() {
    const { toast } = useToast();
    const [salesDataStorage, setSalesDataStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
    const [googleAuthStorage] = useLocalStorage<GoogleAuthStorage>('google-auth-token', { accessToken: null });
    const [syncConfig, setSyncConfig] = useLocalStorage<SyncConfig>('google-sheet-sync-config', {
        interval: 0,
        lastSynced: null,
        sheetId: '',
        sheetName: 'Sheet1'
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const checkAutoSync = async () => {
            // Basic validation
            if (!syncConfig.interval || syncConfig.interval <= 0) return;
            if (!syncConfig.sheetId || !googleAuthStorage.accessToken) return;

            // Check time
            if (syncConfig.lastSynced) {
                const lastSyncTime = new Date(syncConfig.lastSynced).getTime();
                const now = new Date().getTime();
                const minutesSinceLastSync = (now - lastSyncTime) / (1000 * 60);

                if (minutesSinceLastSync < syncConfig.interval) {
                    return; // Not time yet
                }
            } else {
                // If never synced but configured, maybe we should sync? 
                // Or maybe wait for manual first? Let's assume if interval is set, we want to sync.
                // But usually user sets interval AFTER connecting.
            }

            console.log("Global Auto-sync triggered...");

            try {
                const result = await getGoogleSheet({
                    sheetId: syncConfig.sheetId,
                    sheetName: syncConfig.sheetName,
                    accessToken: googleAuthStorage.accessToken
                });

                const newHistoryItem: SalesDataHistoryItem = {
                    fileName: `Google Sheet: ${syncConfig.sheetId.substring(0, 12)}...`,
                    uploadDate: new Date().toISOString(),
                    size: result.length,
                    recordCount: result.trim().split('\n').length - 1,
                    data: result,
                };

                setSalesDataStorage(prev => ({
                    currentData: result,
                    history: [newHistoryItem, ...(prev?.history || [])].slice(0, 10)
                }));

                // Update last synced time
                const newTime = new Date().toISOString();
                setSyncConfig(prev => ({ ...prev, lastSynced: newTime }));

                toast({
                    title: 'Auto-Sync Complete',
                    description: `Background sync finished at ${new Date(newTime).toLocaleTimeString()}.`
                });

            } catch (error: any) {
                console.error("Global Auto-sync error:", error);
                // Optional: Notify user of failure, or just fail silently in background to not annoy them
                // toast({ variant: 'destructive', title: 'Auto-Sync Failed', description: 'Could not update data from Google Sheet.' });
            }
        };

        // Check immediately on mount/config change
        checkAutoSync();

        // Check every minute
        const timer = setInterval(checkAutoSync, 60000);
        return () => clearInterval(timer);

    }, [isMounted, syncConfig.interval, syncConfig.lastSynced, syncConfig.sheetId, syncConfig.sheetName, googleAuthStorage.accessToken]);

    return null; // Headless component
}
