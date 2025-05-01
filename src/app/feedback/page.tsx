
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
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
    // Rating is optional now for contact, but we keep the logic if needed later
    // if (rating === 0) {
    //     toast({
    //         title: "Rating Required",
    //         description: "Please select a star rating.",
    //         variant: "destructive",
    //     });
    //     return;
    // }
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual Server Action call to save feedback/contact message to Firestore
      console.log('Submitting contact message:', { name, email, rating: rating || null, message: suggestions }); // Renamed suggestions to message
      // await saveFeedback({ name, email, rating, suggestions }); // Example server action call

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));


      toast({
        title: "Message Sent!", // Updated title
        description: "Thank you for contacting us. We'll get back to you soon.", // Updated description
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
      console.error("Error submitting message:", error); // Updated log message
      toast({
        title: "Submission Failed",
        description: "Could not send your message. Please try again.", // Updated description
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     // Removed surrounding div and header/footer elements
    <div className="container mx-auto px-4 py-12 flex justify-center"> {/* Changed main to div, added container/padding */}
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle> {/* Updated Title */}
            <CardDescription>Have questions or feedback? Send us a message.</CardDescription> {/* Updated Description */}
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
               {/* Optional Rating - uncomment if needed */}
               {/*
               <div className="space-y-2">
                 <Label>Rating (Optional)</Label>
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
               */}
               <div className="space-y-2">
                <Label htmlFor="suggestions">Message</Label> {/* Updated Label */}
                <Textarea
                  id="suggestions" // Keep ID for now, can rename later
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Your message or feedback..." // Updated placeholder
                  rows={5} // Increased rows
                  required // Make message required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? 'Sending...' : 'Send Message'} {/* Updated Button Text */}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    // Removed Footer
  );
}
