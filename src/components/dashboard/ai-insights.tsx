
'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateBusinessInsights } from '@/ai/flows/ai-business-analyst-insight-narrator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { SalesDataRow } from '@/app/dashboard/page';
import { ScrollArea } from '@/components/ui/scroll-area';

// Basic Markdown to HTML renderer
function Markdown({ content }: { content: string }) {
    // Process lists first, then other inline formatting.
    const processLists = (text: string) => {
        const lines = text.split('\n');
        let html = '';
        let inList = false;
        for (const line of lines) {
            const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            if (isListItem) {
                if (!inList) {
                    html += '<ul class="list-disc pl-5 space-y-1">';
                    inList = true;
                }
                html += `<li>${line.trim().substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<p>${line}</p>`;
            }
        }
        if (inList) {
            html += '</ul>';
        }
        return html;
    };

    let html = processLists(content);
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics

    return <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: html }} />;
}

type AIInsightsProps = {
    dashboardData: SalesDataRow[];
};

export function AIInsights({ dashboardData }: AIInsightsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<{ summary: string; actionableAdvice: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    if (!dashboardData || dashboardData.length === 0) {
        setError('No data available to analyze. Please upload data or clear filters.');
        setIsLoading(false);
        return;
    }

    const dataString = JSON.stringify(dashboardData);

    try {
      const result = await generateBusinessInsights({ dashboardData: dataString });
      setInsights(result);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Generate AI Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Business Analyst</DialogTitle>
          <DialogDescription>
            Get a plain-language summary and actionable advice based on your current
            dashboard data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="py-4">
            {!insights && !isLoading && !error && (
              <div className="text-center p-8">
                <Button onClick={handleGenerateInsights}>
                  <Bot className="mr-2 h-4 w-4" />
                  Analyze My Data
                </Button>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Analyzing your data...</p>
              </div>
            )}
            {error && (
               <Alert variant="destructive">
                 <AlertTitle>Error</AlertTitle>
                 <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
            {insights && (
              <div className="space-y-6">
                  <Alert>
                      <Bot className="h-4 w-4"/>
                      <AlertTitle>Summary</AlertTitle>
                      <AlertDescription>
                           <Markdown content={insights.summary} />
                      </AlertDescription>
                  </Alert>
                  <Alert>
                      <Bot className="h-4 w-4"/>
                      <AlertTitle>Actionable Advice</AlertTitle>
                      <AlertDescription>
                           <Markdown content={insights.actionableAdvice} />
                      </AlertDescription>
                  </Alert>
                  <Button variant="outline" className="w-full" onClick={handleGenerateInsights}>Regenerate</Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
