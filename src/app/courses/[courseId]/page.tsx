import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { YouTubeVideo, getYouTubeVideo } from '@/services/youtube'; // Import service

// Mock course data - replace with data fetched from Firestore later
const coursesData: { [key: string]: { title: string; description: string; longDescription: string; videoId: string; imageUrl: string; imageHint: string } } = {
  'intro-stock-market': {
    title: 'Intro to Stock Market',
    description: 'Learn the fundamentals of the stock market, how it works, and basic investment concepts. Perfect for beginners!',
    longDescription: 'This comprehensive introductory course covers the essential concepts you need to understand the stock market. We\'ll explore topics like what stocks are, how exchanges work, different types of orders, market indices, basic analysis techniques, and the risks involved. By the end of this course, you\'ll have a solid foundation to start your investment learning journey.',
    videoId: 'YSgk5_WXDfE', // Example YouTube Video ID (replace with actual)
    imageUrl: 'https://picsum.photos/800/400',
    imageHint: 'stock market analysis chart',
  },
};


// Fetch video details (can be done server-side)
async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  try {
    // In a real app, fetch from YouTube API or your backend
    // For now, using the mock service
    if (videoId) {
      return await getYouTubeVideo(videoId);
    }
    return null;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}


export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const course = coursesData[courseId];
  const videoDetails = course ? await getVideoDetails(course.videoId) : null;


  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">The course you are looking for does not exist.</p>
        <Link href="/courses" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
     <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/courses" className="mr-6 flex items-center space-x-2 text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-5 w-5" />
             <span>Back to Courses</span>
          </Link>
           <div className="flex-1 flex justify-end">
             {/* Placeholder for potential future actions like bookmark */}
           </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
             <Card className="overflow-hidden shadow-lg">
               <div className="relative h-64 md:h-96 w-full">
                 <Image
                  src={course.imageUrl}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  priority // Prioritize loading the main course image
                  data-ai-hint={course.imageHint}
                />
               </div>
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold">{course.title}</CardTitle>
                 <CardDescription className="text-lg">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Course Content</h3>
                <p className="text-muted-foreground mb-6">{course.longDescription}</p>

                {videoDetails && (
                  <div className="mb-6 p-4 border rounded-lg bg-secondary/50">
                    <h4 className="font-medium mb-1">Course Video:</h4>
                    <p className="text-sm text-muted-foreground">{videoDetails.title}</p>
                  </div>
                )}

                 <h3 className="text-xl font-semibold mb-2">Assessment</h3>
                 <p className="text-muted-foreground">
                    After watching the video, you'll take a short quiz to test your understanding.
                 </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
             <Card className="sticky top-20 shadow-lg"> {/* Sticky card for actions */}
                <CardHeader>
                  <CardTitle>Start Learning</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground mb-6">Ready to begin? Click the button below to start the course video and quiz.</p>
                    <Link href={`/courses/${courseId}/learn`} passHref className="w-full">
                      <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Start Course Now
                        <PlayCircle className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                 </CardContent>
            </Card>
          </div>
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

// Optional: Generate static paths if you know all course IDs beforehand
// export async function generateStaticParams() {
//   const courseIds = Object.keys(coursesData);
//   return courseIds.map((courseId) => ({
//     courseId,
//   }));
// }
