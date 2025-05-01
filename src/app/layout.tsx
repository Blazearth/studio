
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Header } from '@/components/layout/header'; // Import Header
import { Footer } from '@/components/layout/footer'; // Import Footer

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Inter
});


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
    // Apply Inter font variable and default to dark mode
    <html lang="en" className={`${inter.variable} dark`}>
      {/* Apply fade-in animation and font-sans */}
      <body className={`antialiased font-sans flex flex-col min-h-screen animate-fade-in`}>
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
