import React from "react";
import Link from "next/link";
import { Container } from "../ui/container";
import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/5 py-12 md:py-16 text-xs text-muted-foreground transition-colors duration-300">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4 pr-0 md:pr-8">
            <Link href="/" className="flex items-center space-x-2 group focus:outline-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow shadow-primary/10 transition-transform duration-200 group-hover:scale-[1.03]">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground transition-colors duration-150 group-hover:text-primary">
                Frontend<span className="text-primary font-extrabold">Expert</span>
              </span>
            </Link>
            <p className="text-muted-foreground/90 leading-relaxed max-w-xs text-xs">
              Modern, hands-on learning resources tailored for mastering frontend systems, runtime engines, state engines, and web performance.
            </p>
            <div className="flex space-x-4 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-105 transition-all focus:outline-none focus:ring-1 focus:ring-ring rounded"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-foreground text-[10px] tracking-widest uppercase">Platform</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/courses" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Courses</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Articles</Link></li>
              <li><Link href="/challenges" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Challenges</Link></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-bold text-foreground text-[10px] tracking-widest uppercase">Community</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/community" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Join Discord</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Virtual Events</Link></li>
              <li><Link href="/partners" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Partnerships</Link></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-bold text-foreground text-[10px] tracking-widest uppercase">Company</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Terms</Link></li>
              <li><Link href="/support" className="hover:text-foreground transition-colors duration-150 focus:outline-none">Support Contacts</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Frontend Expert. Peer-reviewed technical documentation.</p>
          <p className="text-[10px] text-muted-foreground/60 font-mono">
            Engineered with Next.js 16, React 19, and Tailwind CSS.
          </p>
        </div>
      </Container>
    </footer>
  );
}
