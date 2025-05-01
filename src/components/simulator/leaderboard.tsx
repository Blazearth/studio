
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  data: { userId: string; pnl: number }[];
  isLoading: boolean;
  currentUserId?: string; // Optional: To highlight the current user
}

export default function Leaderboard({ data, isLoading, currentUserId }: LeaderboardProps) {

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Skeleton rows
   const renderSkeletonRows = (count = 5) => {
     return Array.from({ length: count }).map((_, index) => (
       <TableRow key={`leader-skeleton-${index}`}>
         <TableCell className="w-10 text-center"><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
         <TableCell><Skeleton className="h-5 w-24" /></TableCell>
         <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
       </TableRow>
     ));
   };

   // Get rank icon based on position
   const getRankIcon = (rank: number) => {
       if (rank === 1) return <Award className="h-5 w-5 text-yellow-500" />;
       if (rank === 2) return <Award className="h-5 w-5 text-slate-400" />;
       if (rank === 3) return <Award className="h-5 w-5 text-yellow-700" />;
       return <span className="text-sm font-medium">{rank}</span>;
   };


  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Total P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            renderSkeletonRows(5)
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                Leaderboard is empty. Start trading!
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.userId === currentUserId;
              return (
                <TableRow key={entry.userId} className={cn(isCurrentUser && "bg-secondary/50")}>
                  <TableCell className="w-10 text-center font-medium">
                      {getRankIcon(rank)}
                  </TableCell>
                   <TableCell className="font-medium">
                      {/* Displaying partial ID for privacy - replace with username if available */}
                      User {entry.userId.substring(0, 6)}...
                      {isCurrentUser && <span className="ml-2 text-xs text-primary font-semibold">(You)</span>}
                   </TableCell>
                  <TableCell className={`text-right font-semibold ${entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end">
                      {entry.pnl >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {formatCurrency(entry.pnl)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```