"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const options: { value: ThemeOption; label: string; icon: React.ElementType }[] = [
  { value: "light",  label: "Light",  icon: Sun },
  { value: "dark",   label: "Dark",   icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Placeholder during SSR / before mount (same dimensions to prevent layout shift)
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";
  const currentTheme = (theme as ThemeOption) ?? "system";

  // Icon shown in the trigger button reflects the resolved (actual) theme
  const TriggerIcon = isDark ? Moon : Sun;
  const triggerLabel =
    currentTheme === "system"
      ? `Theme: System (${isDark ? "dark" : "light"})`
      : `Theme: ${currentTheme === "dark" ? "Dark" : "Light"}`;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        title={triggerLabel}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-foreground",
          "hover:bg-muted hover:text-primary transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
          open && "bg-muted text-primary border-primary/30"
        )}
      >
        <TriggerIcon className="h-[1.1rem] w-[1.1rem]" />
        {/* Small dot indicator when on system theme */}
        {currentTheme === "system" && (
          <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="menu"
          aria-label="Theme options"
          className={cn(
            "absolute right-0 top-full mt-2 z-50 min-w-[8.5rem]",
            "rounded-xl border border-border bg-popover shadow-lg shadow-black/10",
            "py-1.5 animate-slide-down origin-top-right"
          )}
        >
          {options.map(({ value, label, icon: Icon }) => {
            const isActive = currentTheme === value;
            return (
              <button
                key={value}
                role="menuitem"
                type="button"
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-left transition-colors duration-150",
                  "hover:bg-muted focus:outline-none focus:bg-muted",
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <Check className="h-3 w-3 text-primary shrink-0" aria-label="Currently active" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
