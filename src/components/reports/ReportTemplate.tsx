import React from 'react';
import { ReportData, ReportConfig } from '@/utils/report-engine';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ReportTemplateProps {
    data: ReportData;
    config: ReportConfig;
}

export const ReportTemplate = React.forwardRef<HTMLDivElement, ReportTemplateProps>(({ data, config }, ref) => {
    const { title, dateRange } = config;

    return (
        <div ref={ref} className="bg-white p-8 mx-auto text-slate-900" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="border-b pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{title}</h1>
                    <p className="text-slate-500 text-xs mt-1">
                        Period: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-[10px]">Generated on {format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
                    <p className="text-slate-400 text-[10px]">CommerceCast Analytics</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Executive Summary */}
                {config.sections.executive_summary && data.summary && (
                    <div className="mb-6">
                        <h2 className="text-sm font-bold mb-2 text-slate-800 uppercase border-b border-slate-200 pb-1">Executive Summary</h2>
                        <p className="text-xs text-slate-700 leading-relaxed text-justify">
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Sales Performance */}
                {config.sections.sales && data.sales && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-sm font-bold mb-3 text-slate-800 uppercase border-b border-slate-200 pb-1">Sales Performance</h2>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-500 uppercase">Total Revenue</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.sales.totalRevenue)}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-500 uppercase">Units Sold</p>
                                <p className="text-lg font-bold text-slate-900">{data.sales.totalUnits.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Top Products Table */}
                            <div className="col-span-1">
                                <h3 className="text-xs font-semibold mb-2 text-slate-700">Top Products</h3>
                                <table className="w-full text-[10px] text-left">
                                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                                        <tr>
                                            <th className="p-1 font-medium">Product</th>
                                            <th className="p-1 text-right font-medium">Rev</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.sales.topProducts.map((p, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-0">
                                                <td className="p-1 truncate max-w-[80px]">{p.name}</td>
                                                <td className="p-1 text-right font-medium">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sales Trend Chart */}
                            <div className="col-span-2 h-40 border rounded p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.sales.revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), 'dd MMM')} fontSize={8} tickLine={false} axisLine={false} />
                                        <YAxis tickFormatter={(val) => `₹${val / 1000}k`} fontSize={8} tickLine={false} axisLine={false} />
                                        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={1.5} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Health */}
                {config.sections.inventory && data.inventory && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-sm font-bold mb-3 text-slate-800 uppercase border-b border-slate-200 pb-1">Inventory Health</h2>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-500 uppercase">Stock Value</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', compactDisplay: 'short', notation: 'compact' }).format(data.inventory.totalStockValue)}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-500 uppercase">Low Stock</p>
                                <p className="text-lg font-bold text-amber-600">{data.inventory.lowStockCount}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-500 uppercase">Out of Stock</p>
                                <p className="text-lg font-bold text-red-600">{data.inventory.outOfStockCount}</p>
                            </div>
                        </div>

                        {data.inventory.topLowStock.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold mb-2 text-slate-700">Critical Items</h3>
                                <table className="w-full text-[10px] text-left">
                                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                                        <tr>
                                            <th className="p-1 font-medium">Product</th>
                                            <th className="p-1 text-right font-medium">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.inventory.topLowStock.map((p, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-0">
                                                <td className="p-1 text-red-600 font-medium truncate max-w-[200px]">{p.name}</td>
                                                <td className="p-1 text-right font-bold text-red-600">{p.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Comparison */}
                {config.sections.comparison && data.comparison && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-sm font-bold mb-3 text-slate-800 uppercase border-b border-slate-200 pb-1">Comparison Insights</h2>
                        <div className="bg-slate-50 p-4 rounded border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase">Revenue Change (vs Period B)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-2xl font-bold ${data.comparison.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {data.comparison.revenueChange > 0 ? '+' : ''}{data.comparison.revenueChange.toFixed(1)}%
                                    </span>
                                    <span className="text-slate-400 text-[10px]">
                                        ({data.comparison.periodB})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forecast */}
                {config.sections.forecast && data.forecast && (
                    <div className="mb-6 break-inside-avoid">
                        <h2 className="text-sm font-bold mb-3 text-slate-800 uppercase border-b border-slate-200 pb-1">Forecast Outlook</h2>
                        <div className="bg-indigo-50 p-4 rounded border border-indigo-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-indigo-500 uppercase">Predicted Revenue (Next Period)</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-2xl font-bold text-indigo-700">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.forecast.predictedRevenue)}
                                        </p>
                                        {data.forecast.growthRate !== undefined && (
                                            <p className={`text-[10px] mb-1 font-medium ${data.forecast.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {data.forecast.growthRate > 0 ? '▲' : '▼'} {Math.abs(data.forecast.growthRate).toFixed(1)}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-indigo-500 uppercase">Confidence</p>
                                    <p className="text-lg font-bold text-indigo-700">{(data.forecast.confidence * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center text-slate-300 text-[8px]">
                <p>CommerceCast Analytics Report • Confidential Report • Page 1</p>
            </div>
        </div>
    );
});

ReportTemplate.displayName = 'ReportTemplate';
