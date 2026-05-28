import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tag?: string;
  action?: React.ReactNode;
}

export function SectionHeading({
  title,
  description,
  tag,
  action,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-5 mb-8 md:mb-12",
        className
      )}
      {...props}
    >
      <div className="space-y-2 max-w-2xl">
        {tag && (
          <span className="text-xs font-bold uppercase tracking-widest text-primary/95 dark:text-primary/90">
            {tag}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center self-start md:self-auto">
          {action}
        </div>
      )}
    </div>
  );
}
