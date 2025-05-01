import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Download } from 'lucide-react';

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
  // In a real app, check admin authentication here

  const handleExport = (data: any[], filename: string) => {
    // Basic CSV export simulation
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Simulating export of ${filename}.csv`);
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple Header for Admin */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
             {/* Consider a different logo/indicator for admin */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className="font-bold">StocKaro MVP - Admin</span>
          </Link>
          <div className="flex-1 flex justify-end">
              {/* Add Logout button here later */}
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">Logout (Placeholder)</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

         <Tabs defaultValue="completions" className="w-full">
           <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="completions">
               <Users className="mr-2 h-4 w-4" /> Course Completions
             </TabsTrigger>
             <TabsTrigger value="feedback">
               <MessageSquare className="mr-2 h-4 w-4" /> Feedback Submissions
             </TabsTrigger>
           </TabsList>

           <TabsContent value="completions">
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
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
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.course}</TableCell>
                            <TableCell className="text-right">{user.completedAt}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">No completions yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="feedback">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                   <CardTitle>Feedback Submissions</CardTitle>
                   <CardDescription>User feedback and suggestions.</CardDescription>
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
                       <TableHead>Suggestion</TableHead>
                       <TableHead className="text-right">Submitted At</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                      {mockFeedback.length > 0 ? (
                        mockFeedback.map((fb) => (
                          <TableRow key={fb.id}>
                            <TableCell>{fb.name}</TableCell>
                            <TableCell>{fb.email}</TableCell>
                             <TableCell>
                               <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                  ))}
                               </div>
                             </TableCell>
                            <TableCell className="max-w-xs truncate">{fb.suggestion}</TableCell>
                            <TableCell className="text-right">{fb.submittedAt}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                         <TableRow>
                           <TableCell colSpan={5} className="text-center text-muted-foreground">No feedback submitted yet.</TableCell>
                         </TableRow>
                      )}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>

      </main>

      {/* Simple Footer for Admin */}
      <footer className="py-6 border-t bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Admin Panel - StocKaro MVP © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
