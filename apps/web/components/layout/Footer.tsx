import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12 md:py-16 text-sm text-muted-foreground transition-colors duration-200">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-primary to-accent text-white shadow shadow-primary/10">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Frontend<span className="text-primary font-extrabold">Expert</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Empowering frontend developers to master modern web technologies through premium, hands-on learning experiences.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Articles</Link></li>
              <li><Link href="/challenges" className="hover:text-primary transition-colors">Coding Challenges</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Community</h4>
            <ul className="space-y-2">
              <li><Link href="/community" className="hover:text-primary transition-colors">Join Discord</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Virtual Events</Link></li>
              <li><Link href="/partners" className="hover:text-primary transition-colors">Partnerships</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Frontend Expert. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/80">Built with Next.js 15, React 19, and Tailwind CSS.</p>
        </div>
      </Container>
    </footer>
  );
}
