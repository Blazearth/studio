
'use client'; // Add 'use client' because handleExport uses browser APIs

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Download, Star, ArrowLeft, TrendingUp } from 'lucide-react'; // Added Star, ArrowLeft, TrendingUp
import React, { useState, useEffect } from 'react'; // Import React for useState etc. if needed in future
import { fetchLeaderboardDataAction } from '@/actions/simulator'; // Import leaderboard fetch action

// IMPORTANT: This is a placeholder page.
// Real implementation requires:
// 1. Authentication & Authorization: Ensure only admins can access this page.
// 2. Data Fetching: Fetch actual data from Firestore.
// 3. Server-Side Logic: Potentially use server components or API routes for secure data access.

// Mock Data - Replace with actual data fetched from Firestore
const mockCompletedUsers = [
  { id: 'user1', name: 'Alice Smith', email: 'alice@example.com', course: 'Intro to Stock Market', completedAt: '2024-07-28' },
  { id: 'user2', name: 'Bob Johnson', email: 'bob@example.com', course: 'Intro to Stock Market', completedAt: '2024-07-29' },
];

const mockFeedback = [
   { id: 'fb1', name: 'Charlie Brown', email: 'charlie@example.com', rating: 4, suggestion: 'Great intro course!', submittedAt: '2024-07-28' },
   { id: 'fb2', name: 'Diana Prince', email: 'diana@example.com', rating: 5, suggestion: 'Loved the video quality.', submittedAt: '2024-07-29' },
   { id: 'fb3', name: 'Ethan Hunt', email: 'ethan@example.com', rating: 3, suggestion: 'Quiz was a bit easy.', submittedAt: '2024-07-30' },
];


export default function AdminDashboardPage() {
    const [leaderboardData, setLeaderboardData] = useState<{ userId: string; pnl: number }[]>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

    useEffect(() => {
        // Fetch leaderboard data
        const loadLeaderboard = async () => {
            setIsLoadingLeaderboard(true);
            try {
                const leaders = await fetchLeaderboardDataAction(10); // Fetch top 10 for admin view
                setLeaderboardData(leaders);
            } catch (error) {
                console.error("Error fetching leaderboard for admin:", error);
                // Handle error display if necessary
            } finally {
                setIsLoadingLeaderboard(false);
            }
        };
        loadLeaderboard();
    }, []);


  // In a real app, check admin authentication here

  // useEffect hook needed if window/document is accessed before hydration
  const handleExport = (data: any[], filename: string) => {
    // Basic CSV export simulation - requires client-side interaction
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      alert("Export function requires a browser environment.");
      return; // Guard against server-side execution
    }

    if (!data || data.length === 0) {
       alert("No data to export.");
       return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')); // Basic CSV escaping
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link); // Needs document
    link.click();
    document.body.removeChild(link); // Needs document
    // alert(`Simulating export of ${filename}.csv`); // Can remove alert if download works
  };

   // Helper function to format currency
   const formatCurrency = (value: number) => {
     // Use a default locale like 'en-US' if 'en-IN' causes issues, or handle potential errors.
     try {
         return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
     } catch (e) {
         console.warn("Locale 'en-IN' not supported, falling back to 'en-US'.", e);
         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Fallback
     }
   };


  return (
    // Removed surrounding div and header/footer elements
    <div className="container mx-auto px-4 py-12"> {/* Changed main to div, added container/padding */}
       {/* Back to Home Link is removed as Admin is now in header nav */}

        <h1 className="text-3xl font-bold mb-8 font-heading">Admin Dashboard</h1> {/* Added font-heading */}

         <Tabs defaultValue="completions" className="w-full">
           {/* Updated TabsList to include Leaderboard */}
           <TabsList className="grid w-full grid-cols-3 mb-6">
             <TabsTrigger value="completions">
               <Users className="mr-2 h-4 w-4" /> Course Completions
             </TabsTrigger>
             <TabsTrigger value="feedback">
               <MessageSquare className="mr-2 h-4 w-4" /> Feedback / Contact
             </TabsTrigger>
              <TabsTrigger value="leaderboard">
               <TrendingUp className="mr-2 h-4 w-4" /> Simulator Leaderboard
             </TabsTrigger>
           </TabsList>

           <TabsContent value="completions">
              <Card className="shadow-md"> {/* Added shadow */}
                 <CardHeader className="flex flex-row items-center justify-between pb-4"> {/* Adjusted padding */}
                    <div>
                      <CardTitle>Course Completions</CardTitle>
                      <CardDescription>Users who completed the 'Intro to Stock Market' quiz.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExport(mockCompletedUsers, 'course_completions')}>
                        <Download className="mr-2 h-4 w-4" /> Export Completions
                    </Button>
                 </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="text-right">Completion Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCompletedUsers.length > 0 ? (
                        mockCompletedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.course}</TableCell>
                            <TableCell className="text-right">{user.completedAt}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground"> {/* Added height */}
                            No completions yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="feedback">
             <Card className="shadow-md"> {/* Added shadow */}
               <CardHeader className="flex flex-row items-center justify-between pb-4"> {/* Adjusted padding */}
                 <div>
                   <CardTitle>Feedback & Contact Submissions</CardTitle> {/* Updated title */}
                   <CardDescription>User feedback, suggestions, and contact messages.</CardDescription> {/* Updated description */}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleExport(mockFeedback, 'feedback_submissions')}>
                     <Download className="mr-2 h-4 w-4" /> Export Feedback
                  </Button>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Name</TableHead>
                       <TableHead>Email</TableHead>
                       <TableHead>Rating</TableHead>
                       <TableHead>Message/Suggestion</TableHead> {/* Updated header */}
                       <TableHead className="text-right">Submitted At</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                      {mockFeedback.length > 0 ? (
                        mockFeedback.map((fb) => (
                          <TableRow key={fb.id}>
                            <TableCell className="font-medium">{fb.name}</TableCell>
                            <TableCell>{fb.email}</TableCell>
                             <TableCell>
                              {fb.rating ? (
                               <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-[hsl(var(--accent))] fill-[hsl(var(--accent))]' : 'text-muted-foreground/50'}`} />
                                  ))}
                                   <span className="ml-2 text-xs text-muted-foreground">({fb.rating}/5)</span>
                               </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">N/A</span>
                                )}
                             </TableCell>
                            <TableCell className="max-w-xs truncate">{fb.suggestion}</TableCell>
                            <TableCell className="text-right">{fb.submittedAt}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                         <TableRow>
                           <TableCell colSpan={5} className="h-24 text-center text-muted-foreground"> {/* Added height */}
                             No feedback or messages submitted yet.
                           </TableCell>
                         </TableRow>
                      )}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>

            {/* Simulator Leaderboard Tab Content */}
            <TabsContent value="leaderboard">
                 <Card className="shadow-md">
                     <CardHeader className="flex flex-row items-center justify-between pb-4">
                         <div>
                             <CardTitle>Simulator Leaderboard</CardTitle>
                             <CardDescription>Top users based on total simulated Profit & Loss.</CardDescription>
                         </div>
                         <Button variant="outline" size="sm" onClick={() => handleExport(leaderboardData, 'simulator_leaderboard')}>
                             <Download className="mr-2 h-4 w-4" /> Export Leaderboard
                         </Button>
                     </CardHeader>
                     <CardContent>
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead className="w-[80px]">Rank</TableHead>
                                     <TableHead>User ID</TableHead>
                                     <TableHead className="text-right">Total P&L</TableHead>
                                      {/* Add more columns if needed, e.g., Ban button */}
                                     {/* <TableHead className="text-right">Actions</TableHead> */}
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {isLoadingLeaderboard ? (
                                     <TableRow><TableCell colSpan={3} className="h-24 text-center">Loading leaderboard...</TableCell></TableRow>
                                 ) : leaderboardData.length > 0 ? (
                                     leaderboardData.map((entry, index) => (
                                         <TableRow key={entry.userId}>
                                             <TableCell className="font-medium">{index + 1}</TableCell>
                                             <TableCell>{entry.userId}</TableCell>
                                             <TableCell className={`text-right font-semibold ${entry.pnl >= 0 ? 'text-[hsl(var(--secondary-accent))]' : 'text-[hsl(var(--destructive))]'}`}>
                                                  {formatCurrency(entry.pnl)}
                                             </TableCell>
                                              {/* <TableCell className="text-right">
                                                  <Button variant="destructive" size="sm" onClick={() => alert(`Ban user ${entry.userId}? (Not implemented)`)}>Ban</Button>
                                              </TableCell> */}
                                         </TableRow>
                                     ))
                                 ) : (
                                     <TableRow>
                                         <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                             No leaderboard data available yet.
                                         </TableCell>
                                     </TableRow>
                                 )}
                             </TableBody>
                         </Table>
                     </CardContent>
                 </Card>
             </TabsContent>


         </Tabs>

      </div>
    // Removed Footer
  );
}
