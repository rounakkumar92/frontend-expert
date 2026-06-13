"use client";

import React, { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "typescript", filename }: CodeBlockProps) {
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

  const highlightCode = (rawCode: string, lang: string) => {
    let escaped = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const wrap = (cls: string, content: string) => `<span class="${cls}">${content}</span>`;

    if (
      lang === "typescript" ||
      lang === "javascript" ||
      lang === "ts" ||
      lang === "js" ||
      lang === "tsx" ||
      lang === "jsx"
    ) {
      return escaped
        .replace(
          /\b(const|let|var|function|return|import|export|from|default|class|extends|type|interface|async|await|try|catch|new|typeof|instanceof|as|public|private|static|readonly|keyof|void)\b/g,
          wrap("text-violet-500 dark:text-violet-400 font-semibold", "$1")
        )
        .replace(
          /\b(if|else|for|while|switch|case|break|continue|true|false|null|undefined)\b/g,
          wrap("text-amber-500 font-semibold", "$1")
        )
        .replace(
          /\b([a-zA-Z0-9_]+)(?=\()/g,
          wrap("text-blue-500 dark:text-blue-400 font-medium", "$1")
        )
        .replace(/(\/\/.*)/g, wrap("text-muted-foreground/60 italic font-normal", "$1"))
        .replace(/("[^"]*")/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"))
        .replace(/('[^']*')/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"))
        .replace(/(`[^`]*`)/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"));
    }

    if (lang === "json") {
      return escaped
        .replace(/("[^"]*")(\s*:)/g, `${wrap("text-blue-500 dark:text-blue-400 font-semibold", "$1")}$2`)
        .replace(/:(\s*)("[^"]*")/g, `:$1${wrap("text-accent dark:text-teal-400 font-medium", "$2")}`)
        .replace(/:(\s*)(-?\d+\.?\d*)/g, `:$1${wrap("text-violet-500 dark:text-violet-400", "$2")}`)
        .replace(/:(\s*)(true|false|null)/g, `:$1${wrap("text-amber-500 font-semibold", "$2")}`);
    }

    if (lang === "bash" || lang === "sh" || lang === "shell") {
      return escaped
        .replace(
          /(^|[^a-zA-Z0-9_\-\/])(npm|pnpm|yarn|npx|git|curl|wget|cd|mkdir|rm|ls|cat|echo)\b/g,
          `$1${wrap("text-violet-500 dark:text-violet-400 font-bold", "$2")}`
        )
        .replace(
          /(^|[^a-zA-Z0-9_\-\/])(run|install|add|commit|push|pull|clone|checkout|init|build|dev)\b/g,
          `$1${wrap("text-blue-500 dark:text-blue-400 font-medium", "$2")}`
        )
        .replace(/(\s-[a-zA-Z0-9\-]+|\s--[a-zA-Z0-9\-]+)/g, wrap("text-amber-500 font-normal", "$1"))
        .replace(/("[^"]*")/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"))
        .replace(/(#.*)/g, wrap("text-muted-foreground/60 italic", "$1"));
    }

    if (lang === "css") {
      return escaped
        .replace(
          /([a-zA-Z0-9_\-\.\#\:\,\s]+)(?=\s*\{)/g,
          wrap("text-violet-500 dark:text-violet-400 font-bold", "$1")
        )
        .replace(
          /([a-zA-Z\-]+)(?=\s*\:)/g,
          wrap("text-blue-500 dark:text-blue-400 font-medium", "$1")
        )
        .replace(
          /(\:\s*)([a-zA-Z0-9\-\(\)\s\,\#\%\.]+)(?=;|\})/g,
          (_, p1, p2) => `${p1}${wrap("text-accent dark:text-teal-400 font-medium", p2)}`
        )
        .replace(/(\/\*[\s\S]*?\*\/)/g, wrap("text-muted-foreground/60 italic font-normal", "$1"));
    }

    if (lang === "html" || lang === "xml") {
      return escaped
        .replace(/(&lt;\/?[a-zA-Z0-9\-]+)/g, wrap("text-violet-500 dark:text-violet-400 font-semibold", "$1"))
        .replace(/(\/?&gt;)/g, wrap("text-violet-500 dark:text-violet-400 font-semibold", "$1"))
        .replace(/\b([a-zA-Z\-]+)(?=\s*=\s*")/g, wrap("text-blue-500 dark:text-blue-400 font-medium", "$1"))
        .replace(/("[^"]*")/g, wrap("text-accent dark:text-teal-400 font-medium", "$1"));
    }

    return escaped;
  };

  return (
    <div className="relative group border border-border/60 rounded-xl bg-muted/20 dark:bg-card/25 shadow-sm overflow-hidden my-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/40 font-mono text-[10px] text-muted-foreground/80 font-bold uppercase select-none">
        <div className="flex items-center gap-1.5">
          {filename ? (
            <>
              <FileCode className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span className="font-semibold text-foreground/95 normal-case font-mono">{filename}</span>
            </>
          ) : (
            <span>{language}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code blocks to clipboard"
          className="inline-flex h-6 items-center justify-center rounded border border-border bg-background px-2 font-sans font-bold hover:text-foreground hover:bg-muted active:scale-95 transition-all duration-200 gap-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent" />
              <span className="text-[9px] text-accent">Copied!</span>
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
