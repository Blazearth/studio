
'use server';

// import { firestore } from '@/lib/firebase/firebase-admin'; // Use admin SDK for server actions
// import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue - REMOVED
import type { Trade, UserSimulatorData } from '@/types/simulator';

// --- MOCK DATA / PLACEHOLDERS ---
// Since Firestore is removed, we'll use temporary mock data or throw errors.
const MOCK_INITIAL_BALANCE = 100000;
let mockBalance = MOCK_INITIAL_BALANCE;
let mockTrades: Trade[] = [];
let mockTotalPnl = 0;
let nextTradeId = 1;

// --- Helper Functions (No longer Firestore specific) ---

/** Simulates initializing user data. Returns mock data. */
const initializeUserData = async (userId: string, initialBalance: number): Promise<UserSimulatorData> => {
  console.log(`Simulating data initialization for user ${userId}`);
  // In a real scenario without DB, this might fetch from a different source or just return defaults.
  return {
    balance: mockBalance, // Return current mock balance
    trades: mockTrades, // Return current mock trades
    totalPnl: mockTotalPnl, // Return current mock PNL
  };
};


// --- Server Actions (Modified for No Firestore) ---

/**
 * Fetches simulated user's balance, active trades, and total PNL.
 * Returns mock data.
 */
export async function fetchUserDataAction(userId: string): Promise<UserSimulatorData> {
  if (!userId) throw new Error("User ID is required.");

  // Return current mock state
  return {
    balance: mockBalance,
    trades: mockTrades,
    totalPnl: mockTotalPnl,
  };
}


/**
 * Simulates placing a new trade and saves it to mock data.
 */
export async function placeTradeAction(newTradeData: Omit<Trade, 'id'>): Promise<Trade> {
  if (!newTradeData.userId) throw new Error("User ID is required in trade data.");

  const tradeCost = newTradeData.entryPremium * newTradeData.quantity;
  if (tradeCost > mockBalance) {
      throw new Error("Insufficient simulated balance.");
  }

  const addedTrade: Trade = {
    ...newTradeData,
    id: `mock_trade_${nextTradeId++}`, // Generate a mock ID
  };

  mockTrades.push(addedTrade); // Add to mock trades
  // Don't update balance here, let updateUserBalanceAction handle it if called separately

  console.log(`Simulated placing trade ${addedTrade.id} for user ${newTradeData.userId}`);
  return addedTrade;
}


/**
 * Simulates closing an active trade, removes it from mock data,
 * and updates the mock total P&L.
 */
export async function closeTradeAction(tradeId: string, finalPnl: number): Promise<void> {
    if (!tradeId) throw new Error("Trade ID is required.");

    const tradeIndex = mockTrades.findIndex(t => t.id === tradeId);
    if (tradeIndex === -1) {
        console.error(`Simulated trade ${tradeId} not found.`);
        throw new Error(`Simulated trade ${tradeId} not found.`);
    }

    const userId = mockTrades[tradeIndex].userId; // Get userId from the trade being closed

    // 1. Remove the trade from the mock array
    mockTrades.splice(tradeIndex, 1);

    // 2. Update the mock total P&L
    mockTotalPnl += finalPnl;

    console.log(`Simulated closing trade ${tradeId} for user ${userId}. Updated mock total P&L.`);
}


/**
 * Updates the simulated user's virtual balance in mock data.
 */
export async function updateUserBalanceAction(userId: string, newBalance: number): Promise<void> {
  if (!userId) throw new Error("User ID is required.");
  if (newBalance === null || newBalance === undefined || isNaN(newBalance)) {
      throw new Error("Invalid balance value provided.");
  }

  mockBalance = newBalance; // Update mock balance
  console.log(`Updated simulated balance for user ${userId} to ${newBalance}`);
}

/**
 * Fetches simulated leaderboard data (mock implementation).
 */
export async function fetchLeaderboardDataAction(limit: number = 5): Promise<{ userId: string; pnl: number }[]> {
  console.log("Fetching simulated leaderboard data (mock).");
  // Return mock leaderboard data - in a real app without DB, this would need a source
  // For now, just returning a placeholder based on current mock PNL for the single mock user
  const mockLeaderboard = [
      { userId: 'user_mock_123', pnl: mockTotalPnl }, // Example entry
      { userId: 'user_other_456', pnl: Math.random() * 5000 - 2000 }, // Another mock user
      { userId: 'user_another_789', pnl: Math.random() * 10000 - 1000 },
  ];

  // Sort mock data and limit
  mockLeaderboard.sort((a, b) => b.pnl - a.pnl);
  return mockLeaderboard.slice(0, limit);
}

