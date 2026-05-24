"use client";

import React from "react";
import { NavLink } from "./NavLink";
import { Container } from "../ui/container";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface MobileNavProps {
  navItems: { label: string; href: string }[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Prevent scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="flex md:hidden items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-expanded={isOpen}
        aria-label="Toggle Menu"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="h-5 w-5 transition-all duration-300 rotate-90 scale-100" />
        ) : (
          <Menu className="h-5 w-5 transition-all duration-300 scale-100" />
        )}
      </button>

      {/* Overlay Backdrop Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-0 left-0 z-40 w-screen h-screen bg-background/98 dark:bg-background/99 backdrop-blur-xl flex flex-col justify-between animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <Container className="pt-24 pb-12 flex flex-col justify-between h-full">
            {/* Nav Items list */}
            <nav className="flex flex-col space-y-4 text-left">
              {navItems.map((item, idx) => (
                <div
                  key={item.href}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <NavLink
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-2xl font-bold py-2 px-0 hover:translate-x-1 transition-transform duration-200"
                  >
                    {item.label}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Bottom Panel */}
            <div 
              className="opacity-0 animate-fade-in-up border-t border-border pt-8 mt-auto space-y-6"
              style={{ animationDelay: `${navItems.length * 70}ms` }}
            >
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
                >
                  Get Started
                </Link>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Frontend Expert. Master Web Development.
              </p>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
