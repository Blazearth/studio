
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import TradeForm from './trade-form';
import TradeSummaryTable from './trade-summary-table';
import Leaderboard from './leaderboard'; // Renamed component
import type { Trade, Asset } from '@/types/simulator';
import { placeTradeAction, closeTradeAction, updateUserBalanceAction, fetchUserDataAction, fetchLeaderboardDataAction } from '@/actions/simulator';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const INITIAL_BALANCE = 100000; // ₹1,00,000

// Define assets and their properties (mock strike prices/expiries for now)
// In a real app, this data might come from an API
const assets: Asset[] = [
  { id: 'NIFTY 50', name: 'NIFTY 50', strikePrices: [22000, 22100, 22200, 22300, 22400, 22500], expiries: ['2024-08-29', '2024-09-26'], basePremium: 100 },
  { id: 'BANKNIFTY', name: 'BANKNIFTY', strikePrices: [48000, 48200, 48400, 48600, 48800, 49000], expiries: ['2024-08-28', '2024-09-25'], basePremium: 150 },
  { id: 'Reliance', name: 'Reliance', strikePrices: [2800, 2820, 2840, 2860, 2880, 2900], expiries: ['2024-08-29', '2024-09-26'], basePremium: 50 },
  { id: 'TCS', name: 'TCS', strikePrices: [3800, 3820, 3840, 3860, 3880, 3900], expiries: ['2024-08-29', '2024-09-26'], basePremium: 70 },
  { id: 'Infosys', name: 'Infosys', strikePrices: [1600, 1610, 1620, 1630, 1640, 1650], expiries: ['2024-08-29', '2024-09-26'], basePremium: 30 },
];

interface SimulatorDashboardProps {
  userId: string;
}

export default function SimulatorDashboard({ userId }: SimulatorDashboardProps) {
  const [virtualBalance, setVirtualBalance] = useState<number | null>(null);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<{ userId: string; pnl: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingTrade, setIsPlacingTrade] = useState(false);
  const [isClosingTrade, setIsClosingTrade] = useState<string | null>(null); // Store tradeId being closed
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  // Fetch initial user data (balance, trades) and leaderboard
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, leaders] = await Promise.all([
        fetchUserDataAction(userId),
        fetchLeaderboardDataAction() // Assuming this fetches top users
      ]);

      setVirtualBalance(userData.balance ?? INITIAL_BALANCE); // Use initial balance if not found
      setActiveTrades(userData.trades);
      setLeaderboardData(leaders);

      // If balance was null, set the initial balance in Firestore
      if (userData.balance === null) {
          await updateUserBalanceAction(userId, INITIAL_BALANCE);
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: 'Error Loading Data',
        description: 'Could not fetch your trading data. Using defaults.',
        variant: 'destructive',
      });
      // Set defaults if fetch fails
      setVirtualBalance(INITIAL_BALANCE);
      setActiveTrades([]);
      setLeaderboardData([]);
       // Attempt to set initial balance even if fetch fails
      try {
          await updateUserBalanceAction(userId, INITIAL_BALANCE);
      } catch (initError) {
          console.error('Error setting initial balance:', initError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Simulate price update
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
    // Simulate network delay/processing time
    setTimeout(() => setIsUpdatingPrices(false), 500);

    toast({
        title: "Prices Updated",
        description: "Simulated market prices have been updated.",
    });
  }, []);


  const handlePlaceTrade = async (tradeDetails: Omit<Trade, 'id' | 'entryTime' | 'pnl' | 'userId' | 'currentPremium'>) => {
    if (virtualBalance === null) return;
    setIsPlacingTrade(true);

    const asset = assets.find(a => a.id === tradeDetails.assetId);
    if (!asset) {
        toast({ title: "Error", description: "Invalid asset selected.", variant: "destructive" });
        setIsPlacingTrade(false);
        return;
    }

    // Mock Premium Calculation (replace with actual logic/API if available)
    const entryPremium = asset.basePremium * (1 + (Math.random() - 0.5) * 0.1); // Add +/- 5% randomness
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
      currentPremium: parseFloat(entryPremium.toFixed(2)), // Start current = entry
      pnl: 0,
      entryTime: new Date().toISOString(),
    };

    try {
      const addedTrade = await placeTradeAction(newTrade); // Server action handles saving to DB
      const newBalance = virtualBalance - tradeCost;

      await updateUserBalanceAction(userId, newBalance); // Update balance in DB

      setActiveTrades(prev => [...prev, addedTrade]);
      setVirtualBalance(newBalance);

      toast({
        title: 'Trade Placed Successfully!',
        description: `${tradeDetails.quantity} units of ${tradeDetails.assetId} ${tradeDetails.strikePrice} ${tradeDetails.tradeType} bought.`,
      });
    } catch (error) {
      console.error('Error placing trade:', error);
      toast({
        title: 'Trade Failed',
        description: 'Could not place the trade. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPlacingTrade(false);
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    if (virtualBalance === null) return;
    const tradeToClose = activeTrades.find(t => t.id === tradeId);
    if (!tradeToClose) return;

    setIsClosingTrade(tradeId);

    try {
        // Calculate final P&L based on the *current* simulated premium
        const finalPnl = (tradeToClose.currentPremium - tradeToClose.entryPremium) * tradeToClose.quantity;
        const newBalance = virtualBalance + (tradeToClose.entryPremium * tradeToClose.quantity) + finalPnl; // Return initial cost + P&L

        await closeTradeAction(tradeId, finalPnl); // Server action handles removing from DB & potentially logging P&L
        await updateUserBalanceAction(userId, newBalance); // Update balance in DB

        setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
        setVirtualBalance(newBalance);
        // Refresh leaderboard after closing a trade
        const leaders = await fetchLeaderboardDataAction();
        setLeaderboardData(leaders);


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
      setIsClosingTrade(null); // Reset loading state for this specific trade
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
            {isLoading ? (
               <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
             ) : (
               <p className="text-2xl font-bold">
                 ₹{virtualBalance !== null ? virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}
               </p>
            )}
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
                closingTradeId={isClosingTrade} // Pass loading state for specific trade
                isLoading={isLoading} // Pass overall loading state for skeleton
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
           <Leaderboard data={leaderboardData} isLoading={isLoading} currentUserId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
```