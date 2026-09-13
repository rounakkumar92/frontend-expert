import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function LogoIcon({ size = 32, className, showGlow = false, ...props }: LogoIconProps) {
  // Use React.useId for unique SVG gradient IDs across multiple instances
  const id = React.useId().replace(/:/g, "");
  const bgGradId = `fe-bg-${id}`;
  const borderGradId = `fe-border-${id}`;
  const leftGradId = `fe-left-${id}`;
  const rightGradId = `fe-right-${id}`;
  const slashGradId = `fe-slash-${id}`;
  const glowFilterId = `fe-glow-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-200", className)}
      role="img"
      aria-label="Frontend Expert Mark"
      {...props}
    >
      <defs>
        {/* Background Squircle Gradient */}
        <linearGradient id={bgGradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Outer Border Glow Gradient */}
        <linearGradient id={borderGradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>

        {/* Left Chevron (<): Electric Cyan -> Ocean Blue */}
        <linearGradient id={leftGradId} x1="12" y1="18" x2="28" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Right Chevron (>): Royal Indigo -> Violet */}
        <linearGradient id={rightGradId} x1="36" y1="18" x2="52" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Dynamic Center Slash (/): Neon Cyan to Vibrant Violet */}
        <linearGradient id={slashGradId} x1="28" y1="14" x2="36" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Ambient Glow Filter */}
        <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dark Squircle Container */}
      <rect width="64" height="64" rx="16" fill={`url(#${bgGradId})`} />
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        rx="15.25"
        stroke={`url(#${borderGradId})`}
        strokeWidth="1.5"
      />

      {/* Optional Ambient Core Glow */}
      {showGlow && (
        <circle cx="32" cy="32" r="16" fill="#38bdf8" opacity="0.18" filter={`url(#${glowFilterId})`} />
      )}

      {/* Left Code Chevron '<' */}
      <path
        d="M23 18L13.8 29.5C12.7 30.9 12.7 33.1 13.8 34.5L23 46"
        stroke={`url(#${leftGradId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Code Chevron '>' */}
      <path
        d="M41 18L50.2 29.5C51.3 30.9 51.3 33.1 50.2 34.5L41 46"
        stroke={`url(#${rightGradId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Forward Slash '/' */}
      <path
        d="M36 16L28 48"
        stroke={`url(#${slashGradId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Central Nexus Spark */}
      <circle cx="32" cy="32" r="3.2" fill="#ffffff" />
      <circle cx="32" cy="32" r="5.5" fill="#38bdf8" opacity="0.5" />
    </svg>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  asLink?: boolean;
  href?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className,
  asLink = true,
  href = "/",
}: LogoProps) {
  const iconSizes = {
    sm: 26,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const content = (
    <div className={cn("flex items-center space-x-2.5 group focus:outline-none select-none", className)}>
      <div className="relative group-hover:scale-[1.04] active:scale-95 transition-transform duration-200">
        <LogoIcon size={iconSizes[size]} showGlow />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground transition-colors duration-200",
            textSizes[size]
          )}
        >
          Frontend
          <span className="font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent ml-0.5">
            Expert
          </span>
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex focus:outline-none rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
