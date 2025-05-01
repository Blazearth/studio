
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, DollarSign } from 'lucide-react'; // Using DollarSign as a placeholder logo icon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/feedback', label: 'Contact' }, // Renamed Feedback to Contact
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              StocKaro {/* Changed from StocKaro MVP */}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Link href="/" className="flex items-center space-x-2">
             <DollarSign className="h-6 w-6 text-primary" />
             <span className="font-bold">StocKaro</span> {/* Changed from StocKaro MVP */}
           </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
               <nav className="flex flex-col space-y-4 mt-8">
                 {navLinks.map((link) => (
                   <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                       "px-4 py-2 text-lg font-medium transition-colors hover:text-foreground/80",
                       pathname === link.href ? "text-foreground bg-muted" : "text-foreground/60"
                    )}
                   >
                     {link.label}
                   </Link>
                 ))}
                 {/* Add Login/Auth button here in mobile menu later */}
                 <div className="px-4 pt-4">
                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                 </div>
               </nav>
            </SheetContent>
          </Sheet>
        </div>


        {/* Desktop Login Button Area - Pushed to the right */}
        <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
           {/* Add Login/Auth button here later */}
           <Button variant="ghost">Login</Button>
        </div>
      </div>
    </header>
  );
}

