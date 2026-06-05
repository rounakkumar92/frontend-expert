"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy clipboard", err);
    }
  };

  // Bespoke high-fidelity Regex Syntax Highlighter
  const highlightCode = (rawCode: string, lang: string) => {
    // 1. Escape HTML to prevent injection issues
    let escaped = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Helper token wrappers
    const wrap = (cls: string, content: string) => `<span class="${cls}">${content}</span>`;

    // Highlighting rules based on standard languages
    if (lang === "typescript" || lang === "javascript" || lang === "ts" || lang === "js") {
      return escaped
        // Keywords
        .replace(
          /\b(const|let|var|function|return|import|export|from|default|class|extends|type|interface|async|await|try|catch|new|typeof|instanceof|as|const|public|private)\b/g,
          wrap("text-primary dark:text-violet-400 font-semibold", "$1")
        )
        // Control structures / Booleans / Null
        .replace(
          /\b(if|else|for|while|switch|case|break|continue|true|false|null|undefined)\b/g,
          wrap("text-amber-500 font-semibold", "$1")
        )
        // Function declarations/calls (word followed by parenthesis)
        .replace(
          /\b([a-zA-Z0-9_]+)(?=\()/g,
          wrap("text-blue-500 dark:text-blue-400 font-medium", "$1")
        )
        // Comments (single line and multi line) - note we do simple patterns that don't collide with wraps
        .replace(/(\/\/.*)/g, wrap("text-muted-foreground/60 italic font-normal", "$1"))
        // Strings (double quotes, single quotes, backticks)
        .replace(/("[^"]*")/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"))
        .replace(/('[^']*')/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"))
        .replace(/(`[^`]*`)/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"));
    }

    if (lang === "css") {
      return escaped
        // Selectors
        .replace(
          /([a-zA-Z0-9_\-\.\#\:\,\s]+)(?=\s*\{)/g,
          wrap("text-primary dark:text-violet-400 font-bold", "$1")
        )
        // Rules / Properties
        .replace(
          /([a-zA-Z\-]+)(?=\s*\:)/g,
          wrap("text-blue-500 dark:text-blue-400 font-medium", "$1")
        )
        // Colors & Values (following a colon)
        .replace(
          /(\:\s*)([a-zA-Z0-9\-\(\)\s\,\#\%\.]+)(?=;|\})/g,
          (_, p1, p2) => `${p1}${wrap("text-accent dark:text-teal-400 font-medium", p2)}`
        )
        // Comments
        .replace(/(\/\*[\s\S]*?\*\/)/g, wrap("text-muted-foreground/60 italic font-normal", "$1"));
    }

    if (lang === "html" || lang === "xml") {
      return escaped
        // Tag names
        .replace(
          /(&lt;\/?[a-zA-Z0-9\-]+)/g,
          wrap("text-primary dark:text-violet-400 font-semibold", "$1")
        )
        // Ending tag bracket
        .replace(/(\/?&gt;)/g, wrap("text-primary dark:text-violet-400 font-semibold", "$1"))
        // Attributes (word followed by =)
        .replace(
          /\b([a-zA-Z\-]+)(?=\s*=\s*")/g,
          wrap("text-blue-500 dark:text-blue-400 font-medium", "$1")
        )
        // Attribute values
        .replace(/("[^"]*")/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"));
    }

    // Default fallback
    return escaped;
  };

  return (
    <div className="relative group border border-border/60 rounded-xl bg-muted/20 dark:bg-card/25 shadow-sm overflow-hidden my-6">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/40 font-mono text-[10px] text-muted-foreground/80 font-bold uppercase select-none">
        <span>{language}</span>
        
        {/* Copy Utility Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code blocks to clipboard"
          className="inline-flex h-6 items-center justify-center rounded border border-border bg-background px-2 font-sans font-bold hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-200 gap-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent animate-fade-in" />
              <span className="text-[9px] text-accent animate-fade-in">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-muted-foreground/85" />
              <span className="text-[9px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre">
        <pre className="focus:outline-none">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(code.trim(), language.toLowerCase()),
            }}
          />
        </pre>
      </div>
    </div>
  );
}
