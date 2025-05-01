
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
    // Removed surrounding div and header/footer elements
    <div className="container mx-auto px-4 py-12 md:py-16"> {/* Changed main to div, added container/padding */}
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
           <Card className="flex flex-col items-center justify-center border-dashed border-2 text-muted-foreground p-8 h-full min-h-[300px]"> {/* Added min-height */}
             <PlayCircle className="h-12 w-12 mb-4" />
             <p className="text-center font-medium">More courses coming soon!</p>
           </Card>
        </div>
      </div>
    // Removed Footer
  );
}
