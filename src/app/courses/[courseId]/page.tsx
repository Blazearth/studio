import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { YouTubeVideo, getYouTubeVideo } from '@/services/youtube'; // Import service

// Mock course data - replace with data fetched from Firestore later
const coursesData: { [key: string]: { title: string; description: string; longDescription: string; videoId: string; imageUrl: string; imageHint: string; isFree: boolean } } = {
  'intro-stock-market': {
    title: 'Intro to Stock Market',
    description: 'Learn the fundamentals of the stock market, how it works, and basic investment concepts. Perfect for beginners!',
    longDescription: 'This comprehensive introductory course covers the essential concepts you need to understand the stock market. We\'ll explore topics like what stocks are, how exchanges work, different types of orders, market indices, basic analysis techniques, and the risks involved. By the end of this course, you\'ll have a solid foundation to start your investment learning journey.',
    videoId: 'YSgk5_WXDfE', // Example YouTube Video ID (replace with actual)
    imageUrl: 'https://picsum.photos/800/400?random=11',
    imageHint: 'stock market analysis chart finance laptop screen', // Updated hint
    isFree: true,
  },
   'options-trading-basics': {
    title: 'Options Trading Basics',
    description: 'Understand call and put options, basic strategies like covered calls, and the risks involved in options trading.',
    longDescription: 'Dive into the world of options trading. This course explains the core concepts of call and put options, introduces common terminology (strike price, expiry, premium), explores basic strategies like buying calls/puts and covered calls, and highlights the significant risks associated with options.',
    videoId: 'sdMfLkg3MgQ', // Example YouTube Video ID for Options
    imageUrl: 'https://picsum.photos/800/400?random=12',
    imageHint: 'options trading strategy analysis data screen', // Updated hint
    isFree: false,
  },
  'technical-analysis-101': {
    title: 'Technical Analysis 101',
    description: 'Get started with reading stock charts, identifying trends, support/resistance levels, and common indicators.',
    longDescription: 'Learn the basics of technical analysis to help you make trading decisions. This course covers how to read candlestick charts, identify uptrends and downtrends, understand support and resistance levels, and introduces popular indicators like Moving Averages and RSI.',
    videoId: 'eynxyoKgpng', // Example YouTube Video ID for Technical Analysis
    imageUrl: 'https://picsum.photos/800/400?random=13',
    imageHint: 'technical analysis stock chart patterns finance screen graph', // Updated hint
    isFree: true,
  },
  'fundamental-analysis-guide': {
    title: 'Fundamental Analysis Guide',
    description: 'Learn how to evaluate a company\'s financial health by analyzing balance sheets, income statements, and cash flow.',
    longDescription: 'Discover how to assess the intrinsic value of a stock through fundamental analysis. This guide explains how to read and interpret key financial statements like the balance sheet, income statement, and cash flow statement. Learn about important financial ratios and metrics used to evaluate a company\'s performance and value.',
    videoId: 'DvpaF3g_798', // Example YouTube Video ID for Fundamental Analysis
    imageUrl: 'https://picsum.photos/800/400?random=14',
    imageHint: 'financial statements analysis report stocks document paper', // Updated hint
    isFree: false,
  },
  // Added Courses
  'risk-management-strategies': {
    title: 'Risk Management Strategies',
    description: 'Learn essential techniques to manage risk in your stock market investments, including stop-loss orders and diversification.',
    longDescription: 'Master the art of protecting your capital in the stock market. This course delves into crucial risk management techniques, explaining concepts like setting stop-loss orders, position sizing, portfolio diversification across different asset classes and sectors, and understanding risk tolerance. Equip yourself with the tools to invest more confidently.',
    videoId: 'qfmjEv8k72w', // Example YouTube Video ID for Risk Management
    imageUrl: 'https://picsum.photos/800/400?random=15',
    imageHint: 'investment risk management diversification finance chess game', // Updated hint
    isFree: true,
  },
  'behavioral-finance-intro': {
    title: 'Intro to Behavioral Finance',
    description: 'Understand how psychological biases can affect investment decisions and learn strategies to overcome them.',
    longDescription: 'Explore the fascinating intersection of psychology and finance. This introductory course explains common behavioral biases (like confirmation bias, loss aversion, herd mentality) that influence investor behavior. Learn to recognize these biases in yourself and others, and discover practical strategies to make more rational investment decisions.',
    videoId: 'F8sPQEV3kG8', // Example YouTube Video ID for Behavioral Finance
    imageUrl: 'https://picsum.photos/800/400?random=16',
    imageHint: 'behavioral finance psychology decision making investment brain diagram', // Updated hint
    isFree: false,
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height)-var(--footer-height))] text-center container mx-auto px-4 py-12"> {/* Adjusted height and padding */}
        <h1 className="text-2xl font-bold mb-4 font-heading">Course Not Found</h1> {/* Added font-heading */}
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
     // Removed surrounding div and header/footer elements
     <div className="container mx-auto px-4 py-12 md:py-16"> {/* Changed main to div, added container/padding */}
        {/* Back to Courses Link - moved above grid */}
        <div className="mb-8">
           <Link href="/courses" passHref>
             <Button variant="outline" size="sm">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Courses
             </Button>
           </Link>
        </div>

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
                     {course.isFree ? (
                      <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 text-sm font-semibold rounded shadow-md">
                        FREE
                      </span>
                    ) : (
                      <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 text-sm font-semibold rounded shadow-md">
                        PREMIUM
                      </span>
                    )}
                </div>
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold font-heading">{course.title}</CardTitle> {/* Added font-heading */}
                 <CardDescription className="text-lg">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2 font-heading">Course Content</h3> {/* Added font-heading */}
                <p className="text-muted-foreground mb-6">{course.longDescription}</p>

                {videoDetails && (
                  <div className="mb-6 p-4 border rounded-lg bg-secondary/50">
                    <h4 className="font-medium mb-1 font-heading">Course Video:</h4> {/* Added font-heading */}
                    <p className="text-sm text-muted-foreground">{videoDetails.title}</p>
                  </div>
                )}

                 <h3 className="text-xl font-semibold mb-2 font-heading">Assessment</h3> {/* Added font-heading */}
                 <p className="text-muted-foreground">
                    After watching the video, you'll take a short quiz to test your understanding.
                 </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
             {/* Adjusted top position for sticky card */}
             <Card className="sticky top-[calc(theme(spacing.14)_+_theme(spacing.8))] shadow-lg">
                <CardHeader>
                  <CardTitle>Start Learning</CardTitle>
                 </CardHeader>
                 <CardContent>
                    {course.isFree ? (
                         <>
                            <p className="text-muted-foreground mb-6">Ready to begin? Click the button below to start the course video and quiz.</p>
                            <Link href={`/courses/${courseId}/learn`} passHref className="w-full">
                              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                Start Course Now
                                <PlayCircle className="ml-2 h-5 w-5" />
                              </Button>
                            </Link>
                         </>
                     ) : (
                         <>
                            <p className="text-muted-foreground mb-6">This is a premium course. Upgrade to access.</p>
                            {/* Replace with actual link or action to upgrade */}
                            <Button size="lg" className="w-full" disabled>
                                Upgrade to Premium
                                <PlayCircle className="ml-2 h-5 w-5" />
                             </Button>
                         </>
                     )}
                 </CardContent>
            </Card>
          </div>
        </div>
      </div>
     // Removed Footer
  );
}

// Optional: Generate static paths if you know all course IDs beforehand
// export async function generateStaticParams() {
//   const courseIds = Object.keys(coursesData);
//   return courseIds.map((courseId) => ({
//     courseId,
//   }));
// }
