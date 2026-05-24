"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive 
          ? "text-primary dark:text-foreground font-semibold" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {/* Sliding/Fading Hover Pill Background (Linear/Vercel style) */}
      <span 
        className={cn(
          "absolute inset-0 rounded-lg bg-muted/60 dark:bg-secondary/60 opacity-0 scale-[0.97] transition-all duration-200 ease-out -z-10",
          "group-hover:opacity-100 group-hover:scale-100",
          isActive && "opacity-100 scale-100 bg-muted/80 dark:bg-secondary/80 border border-border/20"
        )}
      />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
