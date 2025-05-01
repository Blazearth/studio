
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Trade } from '@/types/simulator';
import { TrendingUp, TrendingDown, XCircle } from 'lucide-react';
import { format } from 'date-fns'; // For formatting date

interface TradeSummaryTableProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
  closingTradeId: string | null; // ID of the trade currently being closed
  isLoading: boolean; // Keep for potential manual refreshes/updates, but initial load handled by parent/Suspense
}

export default function TradeSummaryTable({ trades, onCloseTrade, closingTradeId, isLoading }: TradeSummaryTableProps) {

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Skeleton rows - still useful if isLoading prop is true during updates
  const renderSkeletonRows = (count = 3) => {
    return Array.from({ length: count }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-12" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-9 w-24" /></TableCell>
      </TableRow>
    ));
  };


  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Strike</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Premium</TableHead>
            <TableHead className="text-right">Unrealized P&L</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Render skeleton only if the isLoading prop is true */}
          {isLoading ? (
            renderSkeletonRows(3)
          ) : trades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No active trades. Place a trade to get started!
              </TableCell>
            </TableRow>
          ) : (
            trades.map((trade) => {
              const isClosingThis = closingTradeId === trade.id;
              const pnl = trade.pnl ?? 0; // Use calculated P&L, default to 0 if undefined
              return (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.assetId}</TableCell>
                  <TableCell>{trade.tradeType}</TableCell>
                  <TableCell>{trade.strikePrice.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{format(new Date(trade.expiry), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right">{trade.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(trade.currentPremium)}</TableCell>
                  <TableCell className={`text-right font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end">
                       {pnl >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                       {formatCurrency(pnl)}
                     </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCloseTrade(trade.id)}
                      disabled={isClosingThis} // Disable button if this trade is being closed
                    >
                      {isClosingThis ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Closing...
                          </>
                      ) : (
                          <>Close <XCircle className="ml-1 h-4 w-4" /></>
                      )}
                    </Button>
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
