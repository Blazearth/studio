'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Award } from 'lucide-react';
import { Certificate, getCertificate } from '@/services/certificate'; // Import service

// Mock course data
const courseTitle = 'Intro to Stock Market';

export default function CertificatePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const [name, setName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState<Certificate | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Run only on client after mount
    setCurrentDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsNameSet(true);
      // Simulate fetching/generating certificate URL
      try {
        const cert = await getCertificate(name); // Use the service
        setCertificateDetails(cert);
      } catch (error) {
         console.error("Error getting certificate:", error);
         // Handle error - maybe show a default state or message
         setCertificateDetails({ name: courseTitle, url: '#' }); // Fallback
      }
    }
  };

  const handleDownload = () => {
     // In a real app, this would trigger a PDF download using the certificateDetails.url
     // For this mock, we can just log or show an alert
     alert(`Downloading certificate for ${name} (Mock - URL: ${certificateDetails?.url})`);
     // Or use window.open(certificateDetails.url, '_blank'); if the URL is valid
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/50">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href={`/courses/${courseId}/learn`} className="mr-6 flex items-center space-x-2 text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-5 w-5" />
             <span>Back to Quiz</span>
          </Link>
           <div className="flex-1 flex justify-center font-semibold text-primary">
              Completion Certificate
           </div>
            <div className="w-32"> {/* Placeholder to balance header */}</div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader className="text-center">
            <Award className="h-16 w-16 mx-auto text-accent mb-4" />
            <CardTitle className="text-3xl font-bold">Certificate of Completion</CardTitle>
            <CardDescription>Congratulations on completing the course!</CardDescription>
          </CardHeader>
          <CardContent>
            {!isNameSet ? (
              <form onSubmit={handleNameSubmit} className="space-y-4 max-w-sm mx-auto">
                <Label htmlFor="name">Enter Your Full Name for the Certificate:</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  required
                  className="text-center"
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                   Generate Certificate
                </Button>
              </form>
            ) : (
               <div ref={certificateRef} className="border-4 border-primary p-8 rounded-lg bg-white text-center relative aspect-[sqrt(2)/1] max-w-full mx-auto overflow-hidden">
                 {/* Simple background pattern */}
                 <div className="absolute inset-0 opacity-5 bg-repeat bg-center" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233498db\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>

                 <div className="relative z-10">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Certificate of Completion</p>
                    <h2 className="text-4xl font-bold text-primary mb-4">StocKaro MVP</h2>
                    <p className="text-lg text-muted-foreground mb-6">Proudly Presented To</p>
                    <p className="text-3xl font-semibold mb-8">{name}</p>
                    <p className="text-lg text-muted-foreground mb-2">For Successfully Completing</p>
                    <p className="text-xl font-medium mb-8">{courseTitle}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                       <span>Date: {currentDate}</span>
                       <span>StocKaro Team</span>
                     </div>
                 </div>
              </div>
            )}
          </CardContent>
          {isNameSet && certificateDetails && (
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
               <Button onClick={handleDownload} variant="outline" className="border-accent text-accent hover:bg-accent/10 w-full sm:w-auto">
                 <Download className="mr-2 h-4 w-4" />
                 Download Certificate (Mock)
               </Button>
                <Link href="/courses" passHref>
                   <Button variant="secondary" className="w-full sm:w-auto">Explore More Courses</Button>
                 </Link>
            </CardFooter>
          )}
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
