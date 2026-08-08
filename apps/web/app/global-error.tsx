"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global critical layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 antialiased font-sans">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/60 p-8 text-center shadow-2xl glass space-y-6">
          <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">System Error</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A critical application error occurred. Click below to recover the application session.
            </p>
          </div>

          {error?.message && (
            <div className="text-left font-mono text-[10px] bg-muted/50 border border-border/40 p-3 rounded-xl text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-32">
              {error.message}
            </div>
          )}

          <button
            onClick={() => reset()}
            className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
