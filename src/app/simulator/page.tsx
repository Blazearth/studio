
import { Suspense } from 'react';
import SimulatorDashboard from '@/components/simulator/simulator-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Mock User ID - Replace with actual Firebase Auth user ID
const MOCK_USER_ID = 'user_mock_123';

// TODO: Add Firebase Auth integration to get the real user ID

export default function SimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Trading Simulator
      </h1>

      {/*
        Wrap the dashboard in Suspense for potential data loading states.
        Pass the userId to the dashboard component.
      */}
      <Suspense fallback={<SimulatorSkeleton />}>
        {/* In a real app, get userId from authentication context/session */}
        <SimulatorDashboard userId={MOCK_USER_ID} />
      </Suspense>
    </div>
  );
}

// Skeleton component for loading state
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
```