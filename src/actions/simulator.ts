
'use server';

import { firestore } from '@/lib/firebase/firebase-admin'; // Use admin SDK for server actions
import type { Trade, UserSimulatorData } from '@/types/simulator';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue

const usersCollection = firestore.collection('simulatorUsers');

// --- Helper Functions ---

/** Gets the Firestore document reference for a user. */
const getUserDocRef = (userId: string) => usersCollection.document(userId);

/** Gets the Firestore collection reference for a user's trades. */
const getUserTradesCollectionRef = (userId: string) => getUserDocRef(userId).collection('trades');

/** Initializes user data if it doesn't exist. */
const initializeUserData = async (userId: string, initialBalance: number): Promise<UserSimulatorData> => {
  const userDocRef = getUserDocRef(userId);
  const userSnap = await userDocRef.get();

  if (!userSnap.exists) {
    console.log(`Initializing data for user ${userId}`);
    const initialData: UserSimulatorData = {
      balance: initialBalance,
      trades: [], // Start with no active trades in the main doc (they are in subcollection)
      totalPnl: 0,
    };
    await userDocRef.set(initialData);
    return initialData;
  } else {
    // Ensure balance and totalPnl fields exist if document already exists
    const data = userSnap.data() as UserSimulatorData;
    const updates: Partial<UserSimulatorData> = {};
    if (data.balance === undefined || data.balance === null) {
        updates.balance = initialBalance; // Set initial balance if missing
    }
    if (data.totalPnl === undefined) {
        updates.totalPnl = 0;
    }
    if (Object.keys(updates).length > 0) {
        await userDocRef.update(updates);
        console.log(`Updated missing fields for user ${userId}`);
    }
    // Return potentially updated data
     return { ...data, ...updates };
  }
   return userSnap.data() as UserSimulatorData;

};


// --- Server Actions ---

/**
 * Fetches user's balance, active trades, and total PNL.
 * Initializes data if the user doesn't exist.
 */
export async function fetchUserDataAction(userId: string): Promise<UserSimulatorData> {
  if (!userId) throw new Error("User ID is required.");

  const initialBalance = 100000; // Define default initial balance
  const userData = await initializeUserData(userId, initialBalance); // Ensure user doc exists

  // Fetch active trades from the subcollection
  const tradesSnap = await getUserTradesCollectionRef(userId).get();
  const trades = tradesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));

  return {
    ...userData,
    trades: trades, // Return trades from subcollection
    balance: userData.balance ?? initialBalance, // Return initial balance if null
  };
}


/**
 * Places a new trade for the user and saves it to Firestore.
 * IMPORTANT: Balance deduction should happen *before* calling this, or be passed here.
 * This action focuses on saving the trade itself.
 */
export async function placeTradeAction(newTradeData: Omit<Trade, 'id'>): Promise<Trade> {
  if (!newTradeData.userId) throw new Error("User ID is required in trade data.");

  const tradesCollectionRef = getUserTradesCollectionRef(newTradeData.userId);
  const docRef = await tradesCollectionRef.add(newTradeData);

  console.log(`Placed trade ${docRef.id} for user ${newTradeData.userId}`);
  return { id: docRef.id, ...newTradeData };
}


/**
 * Closes an active trade, removes it from the user's trades subcollection,
 * and updates the user's total P&L.
 * IMPORTANT: Balance update (adding P&L + cost basis) should happen *before* or *after* calling this.
 * This action focuses on removing the trade and updating total P&L.
 */
export async function closeTradeAction(tradeId: string, finalPnl: number): Promise<void> {
    if (!tradeId) throw new Error("Trade ID is required.");

    // Need userId to find the correct trade document. Assume it's part of the workflow.
    // In a real app, you'd get this securely (e.g., from session or passed explicitly).
    // For now, we need to fetch the trade to get the userId. This is inefficient.
    // A better approach: Pass userId to this action.
    // **Temporary workaround: Assuming we can find the trade across users (NOT recommended for production)**
    // **REPLACE THIS LOGIC WITH SECURE USER-SPECIFIC FETCHING**

    let userId: string | null = null;
    let tradeRef: FirebaseFirestore.DocumentReference | null = null;

    // Try to find the trade document (inefficiently)
    const usersSnap = await usersCollection.get();
    for (const userDoc of usersSnap.docs) {
        const potentialTradeRef = getUserTradesCollectionRef(userDoc.id).doc(tradeId);
        const tradeSnap = await potentialTradeRef.get();
        if (tradeSnap.exists) {
            userId = userDoc.id;
            tradeRef = potentialTradeRef;
            break;
        }
    }

    if (!userId || !tradeRef) {
        console.error(`Trade ${tradeId} not found.`);
        throw new Error(`Trade ${tradeId} not found.`);
    }

    // Now we have the userId and tradeRef
    const userDocRef = getUserDocRef(userId);

    // Use a transaction to ensure atomicity
    await firestore.runTransaction(async (transaction) => {
        // 1. Delete the trade document from the subcollection
        transaction.delete(tradeRef!);

        // 2. Update the user's total P&L in the main user document
        transaction.update(userDocRef, {
            totalPnl: FieldValue.increment(finalPnl) // Atomically increment P&L
        });
    });

    console.log(`Closed trade ${tradeId} for user ${userId}. Updated total P&L.`);
}


/**
 * Updates the user's virtual balance in Firestore.
 */
export async function updateUserBalanceAction(userId: string, newBalance: number): Promise<void> {
  if (!userId) throw new Error("User ID is required.");
  if (newBalance === null || newBalance === undefined || isNaN(newBalance)) {
      throw new Error("Invalid balance value provided.");
  }

  const userDocRef = getUserDocRef(userId);
  await userDocRef.update({ balance: newBalance });
  console.log(`Updated balance for user ${userId} to ${newBalance}`);
}

/**
 * Fetches leaderboard data (top users by total P&L).
 */
export async function fetchLeaderboardDataAction(limit: number = 5): Promise<{ userId: string; pnl: number }[]> {
  try {
    const leaderboardSnap = await usersCollection
      .orderBy('totalPnl', 'desc') // Order by total P&L descending
      .limit(limit)
      .get();

    if (leaderboardSnap.empty) {
      return [];
    }

    const leaderboardData = leaderboardSnap.docs.map(doc => {
        const data = doc.data() as UserSimulatorData;
        return {
            userId: doc.id,
            pnl: data.totalPnl ?? 0, // Use 0 if totalPnl is missing
        };
    });

    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    // Depending on requirements, you might want to throw the error
    // or return an empty array / default state.
    return [];
  }
}
