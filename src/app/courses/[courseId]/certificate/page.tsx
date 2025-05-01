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
        // Pass course title to the service if needed, currently service defaults
        const cert = await getCertificate(name.trim(), courseTitle);
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
    // Removed surrounding div and header/footer elements
    <div className="container mx-auto px-4 py-12 flex flex-col items-center bg-gradient-to-b from-background to-secondary/50 min-h-[calc(100vh-var(--header-height)-var(--footer-height))]"> {/* Added container/padding and height */}
       {/* Back to Quiz Link */}
       <div className="w-full max-w-3xl mb-8">
         <Link href={`/courses/${courseId}/learn`} passHref>
           <Button variant="outline" size="sm">
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to Quiz
           </Button>
         </Link>
       </div>

        <Card className="w-full max-w-3xl shadow-xl">
          <CardHeader className="text-center pb-4"> {/* Reduced bottom padding */}
            <Award className="h-16 w-16 mx-auto text-accent mb-4" />
            <CardTitle className="text-3xl font-bold">Certificate of Completion</CardTitle>
            <CardDescription>Congratulations on completing the {courseTitle} course!</CardDescription> {/* Added course title */}
          </CardHeader>
          <CardContent>
            {!isNameSet ? (
              <form onSubmit={handleNameSubmit} className="space-y-4 max-w-sm mx-auto">
                <div className="space-y-1.5 text-center"> {/* Wrapped Label and Input */}
                  <Label htmlFor="name" className="text-sm font-medium">Enter Your Full Name for the Certificate:</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    required
                    className="text-center"
                    aria-label="Full name for certificate"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                   Generate Certificate
                </Button>
              </form>
            ) : (
               <div ref={certificateRef} className="border-4 border-primary p-6 md:p-8 rounded-lg bg-white text-center relative aspect-[1.414/1] max-w-full mx-auto overflow-hidden shadow-inner"> {/* A4-ish Aspect Ratio, adjusted padding */}
                 {/* Simple background pattern */}
                 <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-center" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233498db\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M50 40v-8h-4v8h-8v4h8v8h4v-8h8v-4h-8zm0-40V0h-4v8h-8v4h8v8h4V12h8V8h-8zM10 40v-8H6v8H0v4h6v8h4v-8h8v-4H10zM10 8V0H6v8H0v4h6v8h4V12h8V8H10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>

                 <div className="relative z-10 flex flex-col justify-between h-full">
                   <div>
                      <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-1 sm:mb-2">Certificate of Completion</p>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-4">StocKaro</h2>
                      <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">Proudly Presented To</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 sm:mb-8 text-ellipsis overflow-hidden whitespace-nowrap px-4">{name}</p>
                      <p className="text-base sm:text-lg text-muted-foreground mb-1 sm:mb-2">For Successfully Completing</p>
                      <p className="text-lg sm:text-xl font-medium mb-6 sm:mb-8">{courseTitle}</p>
                   </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground mt-auto pt-4 border-t border-dashed">
                       <span>Date: {currentDate}</span>
                       <span>StocKaro Team</span>
                     </div>
                 </div>
              </div>
            )}
          </CardContent>
          {isNameSet && certificateDetails && (
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t">
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
      </div>
    // Removed Footer
  );
}
```