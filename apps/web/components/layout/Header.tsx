"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { ThemeToggle } from "./ThemeToggle";
import { Code2, Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass transition-all duration-200">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-200">
              Frontend<span className="text-primary font-extrabold">Expert</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Courses
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/community"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/95 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-fade-in">
          <Container className="py-4 space-y-3 flex flex-col">
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Courses
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/community"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Dashboard
            </Link>
            <hr className="border-border my-2" />
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95 shadow transition-colors"
            >
              Get Started
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
