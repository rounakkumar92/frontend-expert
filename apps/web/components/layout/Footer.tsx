import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50 py-10 md:py-14 text-xs text-muted-foreground transition-colors duration-300">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group focus:outline-none">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-primary to-accent text-white shadow shadow-primary/10 animate-fade-in">
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Frontend<span className="text-primary font-extrabold">Expert</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-xs">
              Modern, hands-on learning resources tailored for mastering frontend engineering, systems architecture, and web performance.
            </p>
            <div className="flex space-x-3.5 pt-1">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-foreground transition-colors duration-150">Courses</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors duration-150">Articles</Link></li>
              <li><Link href="/challenges" className="hover:text-foreground transition-colors duration-150">Challenges</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs tracking-wider uppercase">Community</h4>
            <ul className="space-y-2">
              <li><Link href="/community" className="hover:text-foreground transition-colors duration-150">Join Discord</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors duration-150">Virtual Events</Link></li>
              <li><Link href="/partners" className="hover:text-foreground transition-colors duration-150">Partnerships</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-xs tracking-wider uppercase">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors duration-150">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors duration-150">Terms</Link></li>
              <li><Link href="/support" className="hover:text-foreground transition-colors duration-150">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 md:mt-14 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Frontend Expert. All rights reserved.</p>
          <p className="text-[10px] text-muted-foreground/70">Engineered with Next.js 15, React 19, and Tailwind CSS.</p>
        </div>
      </Container>
    </footer>
  );
}
