import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagPillProps {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagPill({
  label,
  href,
  active = false,
  onClick,
  className,
}: TagPillProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-all duration-200 border",
    active
      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
      : "bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:border-border"
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, className)}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseStyles, "focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background", className)}
    >
      {label}
    </button>
  );
}
