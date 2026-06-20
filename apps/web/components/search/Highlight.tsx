import React from "react";

interface HighlightProps {
  text: string;
  query: string;
  className?: string;
}

export function Highlight({ text, query, className }: HighlightProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters to avoid code break
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary dark:text-primary-foreground/90 font-bold rounded px-0.5 border border-primary/10 select-all"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
