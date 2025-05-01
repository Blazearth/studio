import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { BookOpen, PlayCircle } from 'lucide-react';

// Mock course data - replace with data fetched from Firestore later
const courses = [
  {
    id: 'intro-stock-market',
    title: 'Intro to Stock Market',
    description: 'Learn the fundamentals of the stock market, how it works, and basic investment concepts. Perfect for beginners!',
    imageUrl: 'https://picsum.photos/400/200',
    imageHint: 'stock chart finance graph',
    isFree: true,
  },
  // Add more courses here in the future
];

export default function CoursesPage() {
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
              <Button variant="ghost" className="font-semibold text-primary">Courses</Button>
            </Link>
            <Link href="/feedback">
              <Button variant="ghost">Feedback</Button>
            </Link>
             {/* Add Login/Auth button here later */}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Available Courses</h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
               <div className="relative h-48 w-full">
                 <Image
                  src={course.imageUrl}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={course.imageHint}
                />
                {course.isFree && (
                  <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
                    FREE
                  </span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="h-20 overflow-hidden text-ellipsis"> {/* Fixed height */}
                   {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Could add tags or duration here later */}
              </CardContent>
              <CardFooter>
                 <Link href={`/courses/${course.id}`} passHref className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        View Course
                        <BookOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
              </CardFooter>
            </Card>
          ))}
           {/* Placeholder for future courses */}
           <Card className="flex flex-col items-center justify-center border-dashed border-2 text-muted-foreground p-8 h-full">
             <PlayCircle className="h-12 w-12 mb-4" />
             <p className="text-center font-medium">More courses coming soon!</p>
           </Card>
        </div>
      </main>

       <footer className="py-6 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} StocKaro MVP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
