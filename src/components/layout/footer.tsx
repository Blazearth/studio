
import React from 'react';

export function Footer() {
  return (
    <footer className="py-6 border-t bg-background">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} StocKaro MVP. All rights reserved.
      </div>
    </footer>
  );
}
