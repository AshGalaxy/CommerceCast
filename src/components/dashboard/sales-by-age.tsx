'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import type { ReactNode } from 'react';

const chartConfig = {
    value: {
        label: 'Sales',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

type AgeData = {
    name: string;
    value: number;
}

type SalesByAgeProps = {
    title: string;
    description: string;
    icon: ReactNode;
    data: AgeData[];
};

export function SalesByAge({ title, description, icon, data }: SalesByAgeProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {icon}
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                label={{ value: 'Age Group', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)}
                                label={{ value: 'Sales', angle: -90, position: 'insideLeft', offset: 0 }}
                            />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
