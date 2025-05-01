'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { saveFeedback } from '@/lib/firebaseActions'; // Placeholder for server action

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        toast({
            title: "Rating Required",
            description: "Please select a star rating.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual Server Action call to save feedback to Firestore
      console.log('Submitting feedback:', { name, email, rating, suggestions });
      // await saveFeedback({ name, email, rating, suggestions }); // Example server action call

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));


      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback.",
        variant: "default", // Use default (non-destructive) style
        className: "bg-accent text-accent-foreground border-accent", // Custom success styling
      });

      // Reset form
      setName('');
      setEmail('');
      setRating(0);
      setHoverRating(0);
      setSuggestions('');

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Failed",
        description: "Could not submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className="font-bold">StocKaro MVP</span>
          </Link>
           <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/courses">
              <Button variant="ghost">Courses</Button>
            </Link>
            <Link href="/feedback">
              <Button variant="ghost" className="font-semibold text-primary">Feedback</Button>
            </Link>
             {/* Add Login/Auth button here later */}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
            <CardDescription>We value your opinion to improve StocKaro.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
               <div className="space-y-2">
                 <Label>Rating</Label>
                 <div className="flex items-center space-x-1">
                   {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                 </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="suggestions">Suggestions</Label>
                <Textarea
                  id="suggestions"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Tell us what you liked or what could be better..."
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

       <footer className="py-6 border-t bg-background mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} StocKaro MVP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
