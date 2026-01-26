'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, BarChart2, Brain, LineChart, ShoppingCart, Percent, FileText, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default function GuidePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur z-50">
                <Link className="flex items-center justify-center gap-2" href="/">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="text-lg font-semibold">Back to Home</span>
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg hidden sm:inline-block">User Guide</span>
                </div>
            </header>

            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="hidden md:block sticky top-24 h-[calc(100vh-8rem)]">
                        <ScrollArea className="h-full">
                            <div className="space-y-4 py-4">
                                <div className="px-3 py-2">
                                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                                        Getting Started
                                    </h2>
                                    <div className="space-y-1">
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#introduction">Introduction</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#dashboard">Dashboard Overview</Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="px-3 py-2">
                                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                                        Features
                                    </h2>
                                    <div className="space-y-1">
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#forecasting">AI Forecasting</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#inventory">Inventory Management</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#promotions">Promotion Simulator</Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link href="#comparison">Sales Comparison</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </aside>

                    {/* Content Content */}
                    <div className="space-y-12">

                        {/* Introduction */}
                        <section id="introduction" className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold tracking-tight font-headline">CommerceCast User Guide</h1>
                                <p className="text-xl text-muted-foreground">
                                    Welcome to the complete documentation for CommerceCast. Learn how to leverage AI to grow your business.
                                </p>
                            </div>
                            <Separator />
                        </section>

                        {/* Dashboard */}
                        <section id="dashboard" className="space-y-6 scroll-mt-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BarChart2 className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold font-headline">Executive Dashboard</h2>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Command Center</CardTitle>
                                    <CardDescription>Real-time monitoring of your business health.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        The dashboard is your landing page after logging in. It aggregates visual data from all modules to give you a snapshot of performance.
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li><strong>Key Metrics:</strong> Top cards show Total Revenue, Net Profit, Orders, and Average Order Value (AOV).</li>
                                        <li><strong>Sales Trend:</strong> A line chart visualizing your revenue over the last 30 days.</li>
                                        <li><strong>Recent Orders:</strong> A live feed of the latest transactions.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Forecasting */}
                        <section id="forecasting" className="space-y-6 scroll-mt-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <LineChart className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold font-headline">AI Forecasting</h2>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Predicting Future Sales</CardTitle>
                                    <CardDescription>Look into the future with our hybrid ensemble engine.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p>
                                            Use this module to forecast sales for the next 30, 60, or 90 days. We combine Prophet (seasonality), XGBoost (trends), and ARIMA (linear) models for maximum accuracy.
                                        </p>
                                        <h3>How to use:</h3>
                                        <ol className="list-decimal pl-6 space-y-2">
                                            <li>Navigate to <strong>Forecasting</strong> from the sidebar.</li>
                                            <li><strong>Upload Data:</strong> Click "Upload CSV" if you have historical sales data (Date, Revenue, Units).</li>
                                            <li><strong>Run Forecast:</strong> Click "Generate Forecast". The AI will process your data.</li>
                                            <li><strong>Analyze:</strong> View the chart to see the predicted trend line (solid) vs. historical data (dotted).</li>
                                        </ol>
                                        <div className="bg-muted p-4 rounded-md mt-4">
                                            <h4 className="font-semibold flex items-center gap-2"><Brain className="h-4 w-4" /> AI Tip</h4>
                                            <p className="text-sm mt-1">
                                                Look for "Seasonal Spikes" in the forecast. These are perfect times to plan inventory stock-ups!
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Inventory */}
                        <section id="inventory" className="space-y-6 scroll-mt-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <ShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold font-headline">Inventory Intelligence</h2>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Smart Stock Management</CardTitle>
                                    <CardDescription>Automated classification and reorder alerts.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        Never run out of stock. This module automatically categorizes your products using <strong>ABC Analysis</strong>.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="border rounded-lg p-4">
                                            <div className="font-bold text-lg mb-1 text-green-600">Class A</div>
                                            <p className="text-sm text-muted-foreground">High Value. Top 20% items generating 80% revenue. <br /><strong>Action:</strong> Never stock out.</p>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="font-bold text-lg mb-1 text-yellow-600">Class B</div>
                                            <p className="text-sm text-muted-foreground">Medium Value. Steady sellers. <br /><strong>Action:</strong> Monitor monthly.</p>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="font-bold text-lg mb-1 text-red-600">Class C</div>
                                            <p className="text-sm text-muted-foreground">Low Value. Slow movers. <br /><strong>Action:</strong> Liquidate/Discount.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Promotions */}
                        <section id="promotions" className="space-y-6 scroll-mt-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Percent className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold font-headline">Promotion Simulator</h2>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>A/B Test Before You Launch</CardTitle>
                                    <CardDescription>Simulate the financial impact of discounts.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        Don't discount blindly. Use the simulator to see if a 20% off sale will actually increase your total profit or just hurt your margins.
                                    </p>
                                    <h3>Steps:</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                        <li>Select a product or category.</li>
                                        <li>Set the <strong>Discount %</strong> (e.g., 10%, 20%).</li>
                                        <li>Set the <strong>Duration</strong> (e.g., 7 days).</li>
                                        <li>Click <strong>Simulate</strong>.</li>
                                    </ul>
                                    <p className="mt-2">
                                        The tool calculates <strong>Projected Lift</strong> (increase in sales volume) vs. <strong>Margin Impact</strong> to give you a Net ROI score.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Comparison */}
                        <section id="comparison" className="space-y-6 scroll-mt-24 mb-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <FileText className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold font-headline">Sales Comparison</h2>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Benchmarking & Analysis</CardTitle>
                                    <CardDescription>Compare performance across time periods.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p>
                                        Use the "Time Travel" feature to compare <strong>This Month</strong> vs. <strong>Last Month</strong> or <strong>This Year</strong> vs. <strong>Last Year</strong>.
                                    </p>
                                    <p>
                                        You can also upload competitor data (CSV) to benchmark your sales against industry standards.
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                    </div>
                </div>
            </main>

            <footer className="py-6 w-full shrink-0 border-t items-center justify-center flex bg-muted/30">
                <p className="text-sm text-muted-foreground">
                    Still have questions? Contact support at <a href="mailto:help@commercecast.com" className="underline hover:text-primary">help@commercecast.com</a>
                </p>
            </footer>
        </div>
    );
}
