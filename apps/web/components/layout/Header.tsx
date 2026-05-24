"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-350",
        isScrolled 
          ? "border-border/80 bg-background/80 dark:bg-background/80 backdrop-blur-md shadow-sm shadow-black/[0.01]" 
          : "border-transparent bg-transparent"
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group focus:outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow-md shadow-primary/10 group-hover:scale-[1.03] active:scale-95 transition-all duration-200">
              <Code2 className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-200">
              Frontend<span className="text-primary font-extrabold">Expert</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/95 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Action */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <MobileNav navItems={NAV_ITEMS} />
          </div>
        </div>
      </Container>
    </header>
  );
}
