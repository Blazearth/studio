
import { Suspense } from 'react';
import SimulatorDashboard from '@/components/simulator/simulator-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchUserDataAction, fetchLeaderboardDataAction } from '@/actions/simulator';
import type { UserSimulatorData } from '@/types/simulator';

// Mock User ID - Replace with actual Firebase Auth user ID (e.g., from server session)
// In a real app, you'd get this from authentication context on the server.
const MOCK_USER_ID = 'user_mock_123';
const INITIAL_BALANCE = 100000; // Define default initial balance

// TODO: Add Firebase Auth integration to get the real user ID server-side

// Make the page component async to fetch data on the server
export default async function SimulatorPage() {
  // Fetch initial data on the server
  // Use Promise.all for parallel fetching
  let initialUserData: UserSimulatorData | null = null;
  let initialLeaderboardData: { userId: string; pnl: number }[] = [];
  let fetchError = false;

  try {
    // Ensure user data is initialized if it doesn't exist during fetch
    // fetchUserDataAction now handles initialization implicitly
    [initialUserData, initialLeaderboardData] = await Promise.all([
      fetchUserDataAction(MOCK_USER_ID), // Fetches or initializes user data
      fetchLeaderboardDataAction(), // Fetches leaderboard
    ]);

    // Ensure balance isn't null if user existed but balance was missing
    if (initialUserData && initialUserData.balance === null) {
        initialUserData.balance = INITIAL_BALANCE;
        // Consider if we need to update the DB again here, fetchUserDataAction should handle it.
    }

  } catch (error) {
    console.error("Error fetching initial simulator data on server:", error);
    fetchError = true;
    // Set default values in case of error
    initialUserData = {
      balance: INITIAL_BALANCE,
      trades: [],
      totalPnl: 0,
    };
    initialLeaderboardData = [];
    // Consider logging this error more formally
  }


  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Trading Simulator
      </h1>

      {/*
        Wrap the dashboard in Suspense. Pass the fetched initial data.
        The client component will use this data for its initial state.
      */}
      <Suspense fallback={<SimulatorSkeleton />}>
        {fetchError && (
          <div className="text-center text-red-600 mb-4">
            Error loading initial data. Displaying default state.
          </div>
        )}
        {/* Pass initial data to the client component */}
        <SimulatorDashboard
          userId={MOCK_USER_ID}
          initialUserData={initialUserData} // Pass potentially null or initialized data
          initialLeaderboardData={initialLeaderboardData}
        />
      </Suspense>
    </div>
  );
}

// Skeleton component for loading state remains the same
function SimulatorSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Practice Trading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-1/3" /> {/* Balance */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" /> {/* Asset */}
            <Skeleton className="h-10 w-full" /> {/* Trade Type */}
            <Skeleton className="h-10 w-full" /> {/* Strike */}
            <Skeleton className="h-10 w-full" /> {/* Expiry */}
            <Skeleton className="h-10 w-full" /> {/* Quantity */}
            <Skeleton className="h-10 w-full" /> {/* Button */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Active Trades</h3>
            <Skeleton className="h-40 w-full" /> {/* Table Skeleton */}
          </div>
          <Skeleton className="h-10 w-32" /> {/* Update Prices Button */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" /> {/* Leaderboard Skeleton */}
        </CardContent>
      </Card>
    </div>
  );
}
