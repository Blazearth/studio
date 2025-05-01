
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import TradeForm from './trade-form';
import TradeSummaryTable from './trade-summary-table';
import Leaderboard from './leaderboard'; // Renamed component
import type { Trade, Asset, UserSimulatorData } from '@/types/simulator';
import { placeTradeAction, closeTradeAction, updateUserBalanceAction, fetchUserDataAction, fetchLeaderboardDataAction } from '@/actions/simulator';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const INITIAL_BALANCE = 100000; // ₹1,00,000

// Define assets and their properties (mock strike prices/expiries for now)
// Updated expiry dates to 2025
const assets: Asset[] = [
  { id: 'NIFTY 50', name: 'NIFTY 50', strikePrices: [22000, 22100, 22200, 22300, 22400, 22500], expiries: ['2025-08-28', '2025-09-25'], basePremium: 100 },
  { id: 'BANKNIFTY', name: 'BANKNIFTY', strikePrices: [48000, 48200, 48400, 48600, 48800, 49000], expiries: ['2025-08-27', '2025-09-24'], basePremium: 150 },
  { id: 'Reliance', name: 'Reliance', strikePrices: [2800, 2820, 2840, 2860, 2880, 2900], expiries: ['2025-08-28', '2025-09-25'], basePremium: 50 },
  { id: 'TCS', name: 'TCS', strikePrices: [3800, 3820, 3840, 3860, 3880, 3900], expiries: ['2025-08-28', '2025-09-25'], basePremium: 70 },
  { id: 'Infosys', name: 'Infosys', strikePrices: [1600, 1610, 1620, 1630, 1640, 1650], expiries: ['2025-08-28', '2025-09-25'], basePremium: 30 },
];

interface SimulatorDashboardProps {
  userId: string;
  initialUserData: UserSimulatorData | null; // Receive initial data from server component
  initialLeaderboardData: { userId: string; pnl: number }[]; // Receive initial leaderboard data
}

export default function SimulatorDashboard({ userId, initialUserData, initialLeaderboardData }: SimulatorDashboardProps) {
  // Initialize state from props
  const [virtualBalance, setVirtualBalance] = useState<number | null>(
    initialUserData?.balance ?? INITIAL_BALANCE // Use prop or default
  );
  const [activeTrades, setActiveTrades] = useState<Trade[]>(
    initialUserData?.trades ?? [] // Use prop or default
  );
  const [leaderboardData, setLeaderboardData] = useState<{ userId: string; pnl: number }[]>(
    initialLeaderboardData // Use prop
  );
  // Loading state is primarily handled by Suspense, but keep for subsequent actions
  const [isLoading, setIsLoading] = useState(false); // Initially false, as data is passed in
  const [isPlacingTrade, setIsPlacingTrade] = useState(false);
  const [isClosingTrade, setIsClosingTrade] = useState<string | null>(null); // Store tradeId being closed
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  // No initial useEffect fetch needed as data comes from props

  // Function to refresh leaderboard data on the client after an action
  const refreshLeaderboard = useCallback(async () => {
      try {
          const leaders = await fetchLeaderboardDataAction();
          setLeaderboardData(leaders);
      } catch (error) {
          console.error("Error refreshing leaderboard:", error);
          // Optionally show a toast notification for the error
      }
  }, []);


  // Simulate price update remains the same
  const handleUpdatePrices = useCallback(() => {
    setIsUpdatingPrices(true);
    setActiveTrades(prevTrades =>
      prevTrades.map(trade => {
        const changePercent = (Math.random() * 15 - 7.5) / 100; // Random change between -7.5% and +7.5%
        const newPremium = Math.max(1, trade.currentPremium * (1 + changePercent)); // Ensure premium doesn't go below 1
        const pnl = (newPremium - trade.entryPremium) * trade.quantity;
        return { ...trade, currentPremium: parseFloat(newPremium.toFixed(2)), pnl: parseFloat(pnl.toFixed(2)) };
      })
    );
    setTimeout(() => setIsUpdatingPrices(false), 500);
    toast({
        title: "Prices Updated",
        description: "Simulated market prices have been updated.",
    });
  }, []);


  // Place trade logic remains largely the same, but refreshes leaderboard at the end
  const handlePlaceTrade = async (tradeDetails: Omit<Trade, 'id' | 'entryTime' | 'pnl' | 'userId' | 'currentPremium'>) => {
    if (virtualBalance === null) return;
    setIsPlacingTrade(true);

    const asset = assets.find(a => a.id === tradeDetails.assetId);
    if (!asset) {
        toast({ title: "Error", description: "Invalid asset selected.", variant: "destructive" });
        setIsPlacingTrade(false);
        return;
    }

    // Simulate realistic premium calculation (can be enhanced)
    // This is a very basic example, a real sim might use volatility, time decay etc.
    let premiumMultiplier = 1.0;
    if (tradeDetails.tradeType === 'Call Option') {
        // Basic logic: Higher strike might be cheaper, lower strike might be expensive
        premiumMultiplier += (asset.strikePrices[Math.floor(asset.strikePrices.length / 2)] - tradeDetails.strikePrice) / (asset.strikePrices[asset.strikePrices.length-1] - asset.strikePrices[0]) * 0.2;
    } else { // Put Option
        premiumMultiplier += (tradeDetails.strikePrice - asset.strikePrices[Math.floor(asset.strikePrices.length / 2)]) / (asset.strikePrices[asset.strikePrices.length-1] - asset.strikePrices[0]) * 0.2;
    }
    // Add some randomness
    premiumMultiplier *= (1 + (Math.random() - 0.5) * 0.1); // +/- 5% random variation

    const entryPremium = Math.max(1, asset.basePremium * premiumMultiplier); // Ensure premium is at least 1


    const tradeCost = entryPremium * tradeDetails.quantity;

    if (tradeCost > virtualBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `Not enough funds to place this trade. Cost: ₹${tradeCost.toFixed(2)}`,
        variant: 'destructive',
      });
      setIsPlacingTrade(false);
      return;
    }

    const newTrade: Omit<Trade, 'id'> = {
      ...tradeDetails,
      userId: userId,
      entryPremium: parseFloat(entryPremium.toFixed(2)),
      currentPremium: parseFloat(entryPremium.toFixed(2)),
      pnl: 0,
      entryTime: new Date().toISOString(),
    };

    try {
      // Use mock action since Firestore is removed
      const addedTrade = await placeTradeAction(newTrade);
      const newBalance = virtualBalance - tradeCost;

      // Update balance using mock action
      await updateUserBalanceAction(userId, newBalance);

      setActiveTrades(prev => [...prev, addedTrade]);
      setVirtualBalance(newBalance);

      toast({
        title: 'Trade Placed Successfully!',
        description: `${tradeDetails.quantity} units of ${tradeDetails.assetId} ${tradeDetails.strikePrice} ${tradeDetails.tradeType} bought.`,
      });

      // Refresh leaderboard after placing trade (optional, depends on requirements)
      // await refreshLeaderboard();

    } catch (error) {
      console.error('Error placing trade:', error);
      toast({
        title: 'Trade Failed',
        // Use error.message if it exists, otherwise provide a generic message
        description: error instanceof Error ? error.message : 'Could not place the trade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPlacingTrade(false);
    }
  };

  // Close trade logic remains largely the same, but calls refreshLeaderboard
  const handleCloseTrade = async (tradeId: string) => {
    if (virtualBalance === null) return;
    const tradeToClose = activeTrades.find(t => t.id === tradeId);
    if (!tradeToClose) return;

    setIsClosingTrade(tradeId);

    try {
        const finalPnl = (tradeToClose.currentPremium - tradeToClose.entryPremium) * tradeToClose.quantity;
        // Calculate balance *after* closing trade: current balance + cost basis + PNL
        // Cost basis = tradeToClose.entryPremium * tradeToClose.quantity
        const newBalance = virtualBalance + (tradeToClose.entryPremium * tradeToClose.quantity) + finalPnl;


        // Use mock actions
        await closeTradeAction(tradeId, finalPnl);
        await updateUserBalanceAction(userId, newBalance);

        setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
        setVirtualBalance(newBalance);

        // Refresh leaderboard after closing a trade
        await refreshLeaderboard();

        toast({
            title: 'Trade Closed',
            description: `Position closed with P&L: ₹${finalPnl.toFixed(2)}`,
            variant: finalPnl >= 0 ? 'default' : 'destructive',
            className: finalPnl >= 0 ? "bg-accent text-accent-foreground border-accent" : "",
        });
    } catch (error) {
      console.error('Error closing trade:', error);
      toast({
        title: 'Closing Failed',
        description: 'Could not close the trade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsClosingTrade(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Trading Form and Summary */}
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Practice Trading</CardTitle>
          <CardDescription>Place virtual trades with a starting balance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Virtual Balance Display */}
          <div className="p-4 border rounded-lg bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Virtual Balance</p>
            {/* Display balance directly from state, which is initialized by props */}
            <p className="text-2xl font-bold">
              ₹{virtualBalance !== null ? virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Error'}
            </p>
          </div>

          {/* Trade Form */}
          <TradeForm
            assets={assets}
            onSubmit={handlePlaceTrade}
            isLoading={isPlacingTrade}
            />

          {/* Active Trades Summary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Trades</h3>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdatePrices}
                    disabled={isUpdatingPrices || activeTrades.length === 0}
                    aria-label="Update Market Prices"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isUpdatingPrices ? 'animate-spin' : ''}`} />
                    Update Prices
                  </Button>
            </div>

            <TradeSummaryTable
                trades={activeTrades}
                onCloseTrade={handleCloseTrade}
                closingTradeId={isClosingTrade}
                // isLoading prop might not be needed here if Suspense handles the initial load
                // Set to false as initial data is provided.
                isLoading={false}
                />
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top traders by simulated P&L.</CardDescription>
        </CardHeader>
        <CardContent>
           {/* Pass initial leaderboard data and handle loading state internally if needed for refreshes */}
           <Leaderboard data={leaderboardData} isLoading={false} currentUserId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
