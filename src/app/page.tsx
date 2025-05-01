import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';
import stockMarketImage from '@/assets/stockaro logo.png';

export default function Home() {
  const mentorshipLink = "https://wa.me/9451807965"; // Replace with your WhatsApp or Typeform link

  return (
    // Removed surrounding div and header/footer elements
    <div className="flex flex-col bg-gradient-to-b from-background to-secondary/50">
      {/* Removed Header */}

      <section className="container mx-auto px-4 py-12 md:py-24"> {/* Changed main to section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary font-heading"> {/* Added font-heading */}
              Welcome to StocKaro!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Learn. Simulate. Grow with StocKaro
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses" passHref>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href={mentorshipLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  Join Mentorship
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src={stockMarketImage}
              alt="Stockaro Logo"
              width={400}
              height={300}
              className="rounded-lg shadow-xl object-contain max-w-[400px] mx-auto"
              priority
            />
          </div>
        </div>

        {/* Optional: Feature Highlights Section */}
        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl font-bold text-center mb-12 font-heading">Why StocKaro?</h2> {/* Added font-heading */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Beginner Friendly Courses</CardTitle>
                <CardDescription>Start your journey with easy-to-understand lessons.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our "Intro to Stock Market" course is designed for absolute beginners.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Interactive Learning</CardTitle>
                <CardDescription>Engage with videos and quizzes to solidify knowledge.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p>Watch informative videos and test your understanding immediately.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Access</CardTitle>
                <CardDescription>Connect with experienced mentors for guidance.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p>Get your questions answered and receive personalized advice.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>

      {/* Removed Footer */}
    </div>
  );
}
