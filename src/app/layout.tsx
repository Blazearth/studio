
import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google'; // Import Poppins and Roboto fonts
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Header } from '@/components/layout/header'; // Import Header
import { Footer } from '@/components/layout/footer'; // Import Footer

// Configure Poppins for headings
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'], // Weights for headings
  variable: '--font-poppins', // CSS variable for Poppins
});

// Configure Roboto for body text
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'], // Weights for body text
  variable: '--font-roboto', // CSS variable for Roboto
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
    // Apply Poppins and Roboto font variables and default to dark mode
    <html lang="en" className={`${poppins.variable} ${roboto.variable} dark`}>
      {/* Apply fade-in animation and default to roboto font for body */}
      <body className={`antialiased font-[--font-roboto] flex flex-col min-h-screen animate-fade-in`}>
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
