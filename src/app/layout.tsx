
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono import as it's not found and possibly unused
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Header } from '@/components/layout/header'; // Import Header
import { Footer } from '@/components/layout/footer'; // Import Footer

export const metadata: Metadata = {
  title: 'StocKaro MVP', // Updated App Name
  description: 'Learn. Simulate. Grow with StocKaro', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed GeistMono variable class */}
      <body className={`${GeistSans.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <Header /> {/* Add Header component */}
        <main className="flex-1"> {/* Added flex-1 to main content area */}
          {children}
        </main>
        <Footer /> {/* Add Footer component */}
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
