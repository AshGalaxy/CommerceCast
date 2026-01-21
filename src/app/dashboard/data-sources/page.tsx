
'use client';

import { useState, useEffect } from 'react';
import { Upload, Sheet, FileUp, Trash2, History, RotateCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/use-local-storage';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authorize, getGoogleSheet } from '@/ai/flows/google-sheets-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SalesDataHistoryItem = {
  fileName: string;
  uploadDate: string;
  size: number;
  recordCount: number;
  data: string; // The raw CSV data
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

export default function DataSourcesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [salesDataStorage, setSalesDataStorage] = useLocalStorage<SalesDataStorage>('sales-data', { currentData: '', history: [] });
  const [googleAuthStorage, setGoogleAuthStorage] = useLocalStorage<GoogleAuthStorage>('google-auth-token', { accessToken: null });
  const [syncConfig, setSyncConfig] = useLocalStorage<SyncConfig>('google-sheet-sync-config', {
    interval: 0,
    lastSynced: null,
    sheetId: '',
    sheetName: 'Sheet1'
  });

  const auth = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  // Use syncConfig for state to persist inputs
  const sheetId = syncConfig.sheetId;
  const sheetName = syncConfig.sheetName;
  const [isSyncing, setIsSyncing] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const isSheetConnected = !!googleAuthStorage.accessToken;

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;

      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        const rows = text.trim().split('\n');

        let headerRowIndex = 0;
        const firstLine = rows[0].trim();
        // Check for metadata row (starts with "Company" or has no commas)
        if (firstLine.toLowerCase().startsWith('company') || !firstLine.includes(',')) {
          headerRowIndex = 1;
        }

        if (rows.length < headerRowIndex + 1) {
          toast({
            variant: "destructive",
            title: "Invalid CSV Format",
            description: "File is empty or missing headers.",
          });
          return;
        }

        const headers = rows[headerRowIndex].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['date', 'product_id'];
        const hasSales = headers.includes('sales') || headers.includes('quantity');

        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (!hasSales) missingHeaders.push('sales OR quantity');

        if (missingHeaders.length > 0) {
          toast({
            variant: "destructive",
            title: "Invalid CSV Format",
            description: `Missing required columns: ${missingHeaders.join(', ')}. Please check the Data Requirements section.`,
          });
          return;
        }

        const recordCount = rows.length - 1; // Exclude header

        const newHistoryItem: SalesDataHistoryItem = {
          fileName: selectedFile.name,
          uploadDate: new Date().toISOString(),
          size: selectedFile.size,
          recordCount: recordCount > 0 ? recordCount : 0,
          data: text,
        };

        setSalesDataStorage(prev => ({
          currentData: text,
          history: [newHistoryItem, ...(prev?.history || [])].slice(0, 10) // Keep last 10 uploads
        }));

        toast({
          title: "File Uploaded Successfully",
          description: `${selectedFile.name} has been processed and is now the active dataset.`,
        });
        setSelectedFile(null); // Reset file input

      } else {
        toast({
          title: "File Type Not Supported",
          description: `Currently, only CSV files are processed. ${selectedFile.name} was not processed.`,
        });
      }
    };
    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      toast({
        variant: "destructive",
        title: "Error Reading File",
        description: "There was a problem reading the file.",
      });
    };

    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      reader.readAsText(selectedFile);
    } else {
      toast({
        title: "File Type Not Supported",
        description: `Currently, only CSV files are processed. ${selectedFile.name} was not processed.`,
      });
    }
  };

  const handleClearData = () => {
    setSalesDataStorage({ currentData: '', history: [] });
    setGoogleAuthStorage({ accessToken: null });
    toast({
      title: "Data Cleared",
      description: "The current sales data has been cleared. The dashboard will now use sample data.",
    });
  };

  const handleReloadHistory = (itemToReload: SalesDataHistoryItem) => {
    setSalesDataStorage(prev => ({
      ...(prev || { currentData: '', history: [] }),
      currentData: itemToReload.data,
    }));
    toast({
      title: "Data Reloaded",
      description: `${itemToReload.fileName} is now the active dataset.`,
    });
  };

  const handleGoogleConnect = async () => {
    if (!auth) {
      toast({ variant: 'destructive', title: 'Auth service not available', description: 'Firebase Auth is not initialized.' });
      return;
    }
    setIsConnecting(true);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        authorize({ token }).then((accessToken) => {
          setGoogleAuthStorage({ accessToken });
          toast({
            title: 'Google Account Connected',
            description: 'You can now sync data from a Google Sheet.',
          });
        }).catch((e) => {
          console.error("Authorization flow error:", e);
          toast({
            variant: 'destructive',
            title: 'Connection Failed',
            description: e.message || 'Could not verify connection with Google.',
          });
        });
      } else {
        toast({ variant: 'destructive', title: 'Connection Failed', description: 'Could not retrieve access token from Google.' });
      }
    } catch (error: any) {
      console.error("Google sign-in popup error:", error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error.message || 'Could not connect to your Google account.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSheetSync = async (isAuto = false) => {
    if (!sheetId || !sheetName) {
      if (!isAuto) toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide both Sheet ID and Sheet Name.' });
      return;
    }
    if (!googleAuthStorage.accessToken) {
      if (!isAuto) toast({ variant: 'destructive', title: 'Not Connected', description: 'Google account is not connected. Please connect first.' });
      return;
    }
    setIsSyncing(true);
    try {
      const result = await getGoogleSheet({ sheetId, sheetName, accessToken: googleAuthStorage.accessToken });
      const newHistoryItem: SalesDataHistoryItem = {
        fileName: `Google Sheet: ${sheetId.substring(0, 12)}...`,
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
      setSyncConfig(prev => ({ ...prev, lastSynced: new Date().toISOString() }));

      if (!isAuto) {
        toast({ title: 'Sync Successful', description: 'Your dashboard is now updated with data from the Google Sheet.' });
      } else {
        toast({ title: 'Auto-Sync Complete', description: 'Background sync from Google Sheets finished.' });
      }

    } catch (error: any) {
      console.error("Google Sheet sync error:", error);
      if (!isAuto) toast({ variant: 'destructive', title: 'Sync Failed', description: error.message || 'Could not fetch data from the Google Sheet. Check the ID, name, and permissions.' });
    } finally {
      setIsSyncing(false);
    }
  };


  const currentHistory = salesDataStorage?.history || [];

  const renderStatusAlert = () => {
    if (!isMounted) {
      return <Skeleton className="h-20 w-full" />;
    }

    if (salesDataStorage?.currentData) {
      return (
        <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <Upload className="h-4 w-4 text-green-700 dark:text-green-300" />
          <AlertTitle className="text-green-900 dark:text-green-200">Data Synced</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-400">
            Your dashboard is currently using your uploaded data. You can clear it to revert to the sample data.
            <Button variant="destructive" size="sm" onClick={handleClearData} className="ml-4 h-auto px-2 py-1 text-xs">
              <Trash2 className="mr-1 h-3 w-3" />
              Clear Data & Connections
            </Button>
          </AlertDescription>
        </Alert>
      );
    } else {
      return (
        <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <Upload className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          <AlertTitle className="text-amber-900 dark:text-amber-200">Using Sample Data</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-400">
            No data has been uploaded. The dashboard is currently displaying sample data. Upload a CSV file below to get started.
          </AlertDescription>
        </Alert>
      );
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold md:text-3xl font-headline">Data Sources</h1>

      {renderStatusAlert()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Upload a File
            </CardTitle>
            <CardDescription>
              Upload your historical sales data from a CSV file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="sales-file">Select file (.csv)</Label>
              <Input id="sales-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <Button className="mt-4" onClick={handleUpload} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sheet className="h-5 w-5" />
              Connect Google Sheet
            </CardTitle>
            <CardDescription>
              Connect your Google account to import data directly from a Google Sheet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isMounted ? (
              <Skeleton className="h-10 w-48" />
            ) : !isSheetConnected ? (
              <Button variant="outline" onClick={handleGoogleConnect} disabled={isConnecting}>
                {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Connect to Google Sheets
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-600">Google Account Connected</p>
                  <Button variant="destructive" size="sm" onClick={() => {
                    setGoogleAuthStorage({ accessToken: null });
                    setSyncConfig(prev => ({ ...prev, sheetId: '', sheetName: 'Sheet1', interval: 0, lastSynced: null }));
                    toast({ title: 'Disconnected', description: 'Google account disconnected and sheet details cleared.' });
                  }}>
                    Disconnect
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sheet-id">Sheet ID or URL</Label>
                  <Input
                    id="sheet-id"
                    value={sheetId}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Extract ID if it's a URL
                      // Format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
                      const match = val.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
                      if (match && match[1]) {
                        setSyncConfig(prev => ({ ...prev, sheetId: match[1] }));
                      } else {
                        setSyncConfig(prev => ({ ...prev, sheetId: val }));
                      }
                    }}
                    placeholder="Enter Google Sheet ID or Paste URL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sheet-name">Sheet Name (e.g., Sheet1)</Label>
                  <Input id="sheet-name" value={sheetName} onChange={(e) => setSyncConfig(prev => ({ ...prev, sheetName: e.target.value }))} placeholder="Enter Sheet Name" />
                </div>
                <Button onClick={() => handleSheetSync(false)} disabled={isSyncing}>
                  {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                  Sync Data
                </Button>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-semibold mb-3">Auto-Sync Settings</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="sync-interval">Sync Frequency</Label>
                    <Select
                      value={syncConfig.interval.toString()}
                      onValueChange={(val: string) => setSyncConfig(prev => ({ ...prev, interval: parseInt(val) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Manual (No Auto-Sync)</SelectItem>
                        <SelectItem value="2">Every 2 Minutes</SelectItem>
                        <SelectItem value="5">Every 5 Minutes</SelectItem>
                        <SelectItem value="60">Every 1 Hour</SelectItem>
                        <SelectItem value="360">Every 6 Hours</SelectItem>
                        <SelectItem value="720">Every 12 Hours</SelectItem>
                        <SelectItem value="1440">Daily (Every 24 Hours)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {syncConfig.interval > 0
                        ? `Data will automatically sync every ${syncConfig.interval < 60 ? `${syncConfig.interval} minutes` : `${syncConfig.interval / 60} hours`} while this page is open.`
                        : "Data will only sync when you click the button above."}
                    </p>
                  </div>
                  {syncConfig.lastSynced && (
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                      <History className="h-3 w-3" />
                      Last Synced: {new Date(syncConfig.lastSynced).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Requirements</CardTitle>
            <CardDescription>
              To use the forecasting and promotion planning features, please provide your sales data. The more data you provide, the more accurate the insights will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Required & Recommended Fields</h3>
              <p className="text-muted-foreground mb-3">Your data file (CSV, Excel, or Google Sheet) should contain the following columns:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><code className="font-mono p-1 bg-muted rounded-sm">Company Name</code>: (Required) The name of your company in the very first row of the CSV (e.g., "Company Name: Acme Corp").</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">date</code>: (Required) The date of the sales record (e.g., YYYY-MM-DD).</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">sales</code> or <code className="font-mono p-1 bg-muted rounded-sm">quantity</code>: (Required) The number of units sold.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">product_id</code>: (Required) A unique identifier for the product.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">revenue</code>: (Recommended) The revenue for that sales record.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">product_category</code>: (Recommended) The category of the product (e.g., "Electronics").</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">product_subcategory</code>: (Recommended) A more granular category (e.g., "Smartphones").</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">customer_id</code>: (Recommended) A unique identifier for the customer.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">region</code>: (Recommended) The geographical state or large area of the sale (e.g., "Maharashtra").</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">sub_region</code>: (Recommended) The geographical city or smaller area of the sale (e.g., "Mumbai").</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">unit_cost</code>: (Recommended) The cost of a single unit to calculate profitability.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mt-4 mb-2">Fields for Deeper Insights</h3>
              <p className="text-muted-foreground mb-3">Consider adding these fields to unlock even more powerful analytics, such as promotion impact analysis, customer segmentation, and payment trend monitoring:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><code className="font-mono p-1 bg-muted rounded-sm">promotion_id</code>: An identifier for any promotion applied to the sale.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">customer_age</code>: The age of the customer.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">customer_gender</code>: The gender of the customer.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">payment_method</code>: The method used for payment (e.g., "Credit Card", "UPI").</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mt-4 mb-2">Inventory Management Fields</h3>
              <p className="text-muted-foreground mb-3">To enable inventory alerts and stock analysis, include these columns:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><code className="font-mono p-1 bg-muted rounded-sm">stock_level</code>: The current quantity on hand for the product.</li>
                <li><code className="font-mono p-1 bg-muted rounded-sm">reorder_point</code>: The stock level at which a low stock alert should be triggered.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-base mt-4 mb-2">AI Models Used</h3>
              <p className="text-muted-foreground">
                Our features leverage Google's state-of-the-art Gemini family of models for a sophisticated technique called Dynamic Ensemble Forecasting. Instead of relying on a single traditional model like XGBoost or ARIMA, our AI analyzes your unique data patterns to apply a custom blend of forecasting methods, ensuring high accuracy and relevant insights. All AI-powered features use the <code className="font-mono p-1 bg-muted rounded-sm">gemini-2.5-flash</code> model for fast and intelligent results.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Upload History
            </CardTitle>
            <CardDescription>
              Review and reload your recently uploaded files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentHistory.length > 0 ? (
              <div className="space-y-4">
                {currentHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{item.fileName}</span>
                      <span className="text-xs text-muted-foreground">
                        Uploaded on {format(new Date(item.uploadDate), 'MMM d, yyyy, p')} | {item.recordCount} records
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleReloadHistory(item)}>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Reload
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upload history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

