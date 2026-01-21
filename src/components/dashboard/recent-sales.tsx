'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Sale = {
  name: string;
  amount: string;
  avatar: string;
  gender?: string;
  age?: number;
  category?: string;
  region?: string;
  date?: string;
  product?: string;
  payment_method?: string;
};

type RecentSalesProps = {
  title: string;
  description: string;
  data: Sale[];
};

export function RecentSales({ title, description, data }: RecentSalesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const [limit, setLimit] = useState(5);
  const [viewAllLimit, setViewAllLimit] = useState(50);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const displayedData = data.slice(0, limit);
  const dialogData = data.slice(0, viewAllLimit);

  const handleViewMore = () => {
    setLimit((prev) => prev + 10);
  };

  // Deterministic avatar generation helper
  const getAvatarUrl = (name: string, seed: string) => {
    if (seed && (seed.startsWith('http') || seed.startsWith('/'))) {
      if (seed.includes('picsum.photos')) return undefined;
      return seed;
    }
    return undefined;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {displayedData.map((sale, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={getAvatarUrl(sale.name, sale.avatar)} alt="Avatar" />
                <AvatarFallback>{getInitials(sale.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.name}</p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{sale.gender || 'N/A'}</span>
                  <span>•</span>
                  <span>{sale.age ? `${sale.age} yrs` : 'N/A'}</span>
                  <span>•</span>
                  <span>{sale.category || 'N/A'}</span>
                  <span>•</span>
                  <span>{sale.region || 'N/A'}</span>
                  <span>•</span>
                  <span>{sale.date || 'N/A'}</span>
                </div>
              </div>
              <div className="ml-auto font-medium">
                {sale.amount.startsWith('₹') || sale.amount.startsWith('$') ? sale.amount : formatCurrency(parseFloat(sale.amount.replace(/[^0-9.-]+/g, '')))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="w-full">
                View All
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
              <DialogHeader>
                <div className="flex items-center justify-between pr-8">
                  <div>
                    <DialogTitle>All Recent Sales</DialogTitle>
                    <DialogDescription>
                      A detailed list of all recent transactions.
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <select
                      className="h-8 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={viewAllLimit}
                      onChange={(e) => setViewAllLimit(Number(e.target.value))}
                    >
                      <option value={50}>Top 50</option>
                      <option value={100}>Top 100</option>
                      <option value={200}>Top 200</option>
                      <option value={500}>Top 500</option>
                    </select>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-hidden min-h-0 mt-4 border rounded-md">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dialogData.map((sale, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={getAvatarUrl(sale.name, sale.avatar)} />
                              <AvatarFallback>{getInitials(sale.name)}</AvatarFallback>
                            </Avatar>
                            {sale.name}
                          </TableCell>
                          <TableCell>{sale.gender || 'N/A'}</TableCell>
                          <TableCell>{sale.age || 'N/A'}</TableCell>
                          <TableCell>{sale.category || 'N/A'}</TableCell>
                          <TableCell>{sale.region || 'N/A'}</TableCell>
                          <TableCell>{sale.date || 'N/A'}</TableCell>
                          <TableCell>
                            {sale.amount.startsWith('₹') || sale.amount.startsWith('$') ? sale.amount : formatCurrency(parseFloat(sale.amount.replace(/[^0-9.-]+/g, '')))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
