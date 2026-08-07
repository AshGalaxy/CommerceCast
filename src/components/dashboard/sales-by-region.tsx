'use client';
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { ReactNode } from 'react';

type RegionData = {
  name: string;
  value: number;
}

type SalesByRegionProps = {
  title: string;
  description: string;
  icon: ReactNode;
  data: RegionData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#2563eb', '#16a34a', '#db2777', '#9333ea', '#ea580c'
];

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SalesByRegion({ title, description, icon, data }: SalesByRegionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Process data: Top N + Others (Dynamic N)
  const { displayData, othersData } = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);

    if (sorted.length <= 6) {
      return { displayData: sorted, othersData: [] };
    }

    let accumulated = 0;
    let splitIndex = 5; // Minimum 5 items

    // Try to find a split index where Top N > Others (accumulated > 50%), up to max 10
    for (let i = 0; i < sorted.length; i++) {
      accumulated += sorted[i].value;
      // Logic: Ensure at least 5 items. Stop if we cross 50% total OR hit 10 items.
      if (i >= 4) {
        if (accumulated > total / 2) {
          splitIndex = i + 1;
          break;
        }
        if (i === 9) { // Hard limit 10 items to keep visualization "understandable"
          splitIndex = 10;
          break;
        }
      }
    }

    // If we are showing almost everything, just show everything
    if (splitIndex >= sorted.length - 1) {
      return { displayData: sorted, othersData: [] };
    }

    const topN = sorted.slice(0, splitIndex);
    const others = sorted.slice(splitIndex);
    const othersValue = others.reduce((sum, item) => sum + item.value, 0);

    return {
      displayData: [...topN, { name: 'Others', value: othersValue, isOthers: true }],
      othersData: others
    };
  }, [data]);

  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

  const handlePieClick = (data: any) => {
    if (data && data.name === 'Others') {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {icon}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}} className="h-full w-full">
                <RechartsPieChart>
                  <Tooltip
                    content={<ChartTooltipContent
                      formatter={(value, name) => [
                        `${value.toLocaleString()} (${((Number(value) / totalValue) * 100).toFixed(1)}%)`,
                        name
                      ]}
                    />}
                  />

                  <Pie
                    data={displayData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="50%"
                    fill="#8884d8"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      return percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : '';
                    }}
                    paddingAngle={2}
                    onClick={handlePieClick}
                    className="cursor-pointer"
                  >
                    {displayData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Others' ? '#94a3b8' : COLORS[index % COLORS.length]}
                        className={entry.name === 'Others' ? 'hover:opacity-80' : ''}
                      />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </RechartsPieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Other Categories</DialogTitle>
            <DialogDescription>
              Detailed breakdown of the "Others" slice.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {othersData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{((item.value / totalValue) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
