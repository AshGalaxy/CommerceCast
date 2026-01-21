'use client';

import { Bar, Line, XAxis, YAxis, Tooltip, Legend, ComposedChart, ResponsiveContainer } from 'recharts';
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
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type SalesData = {
  name: string;
  sales: number;
  revenue: number;
}

type SalesOverTimeProps = {
  title: string;
  description: string;
  icon: ReactNode;
  data: SalesData[];
};

export function SalesOverTime({ title, description, icon, data }: SalesOverTimeProps) {
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
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)}
                  label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: 0 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  label={{ value: 'Sales', angle: 90, position: 'insideRight', offset: 0 }}
                />
                <Tooltip content={<ChartTooltipContent formatter={(value, name) => {
                  if (name === 'revenue') {
                    return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                  }
                  return [Number(value).toLocaleString(), 'Sales'];
                }} />} />
                <Legend />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} yAxisId="right" barSize={30} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  yAxisId="left"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
