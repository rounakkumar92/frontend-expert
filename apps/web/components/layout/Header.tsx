"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Code2, Search, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "../search/SearchDialog";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
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

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-ring shrink-0 select-none mr-1 glass"
              aria-label="Open search dialog"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 font-mono text-[9px] font-bold text-muted-foreground/80 leading-none shadow-sm">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />

            {!isLoading && isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-muted/60 transition-all focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  aria-label="Sign out"
                  title="Sign Out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : !isLoading ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 px-2 py-1"
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
            ) : null}
          </div>

          {/* Mobile Menu Action */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-ring glass"
              aria-label="Open search dialog"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </Container>
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
