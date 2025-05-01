import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function Home() {
  const mentorshipLink = "https://wa.me/yourphonenumber"; // Replace with your WhatsApp or Typeform link

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
             {/* Placeholder Logo - Replace with actual logo if available */}
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
              <Button variant="ghost">Feedback</Button>
            </Link>
            {/* Add Login/Auth button here later */}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
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
                src="https://picsum.photos/600/400"
                alt="Stock Market Learning Illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="stock market graph finance learning"
              />
          </div>
        </div>

        {/* Optional: Feature Highlights Section */}
        <section className="mt-24 md:mt-32">
          <h2 className="text-3xl font-bold text-center mb-12">Why StocKaro?</h2>
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
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} StocKaro MVP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
