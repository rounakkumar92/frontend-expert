"use client";

import React, { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";

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
    const escaped = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const tokens: string[] = [];
    const saveToken = (html: string) => {
      const id = `___TOKEN_${tokens.length}___`;
      tokens.push(html);
      return id;
    };

    let processed = escaped;

    if (
      lang === "typescript" ||
      lang === "javascript" ||
      lang === "ts" ||
      lang === "js" ||
      lang === "tsx" ||
      lang === "jsx"
    ) {
      // 1. Comments first
      processed = processed.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, (match) =>
        saveToken(`<span class="text-muted-foreground/60 italic font-normal">${match}</span>`)
      );
      // 2. Strings next
      processed = processed.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, (match) =>
        saveToken(`<span class="text-accent dark:text-teal-400 font-medium">${match}</span>`)
      );
      // 3. Keywords
      processed = processed.replace(
        /\b(const|let|var|function|return|import|export|from|default|class|extends|type|interface|async|await|try|catch|new|typeof|instanceof|as|public|private|static|readonly|keyof|void)\b/g,
        (match) => saveToken(`<span class="text-violet-500 dark:text-violet-400 font-semibold">${match}</span>`)
      );
      // 4. Control flow & booleans
      processed = processed.replace(
        /\b(if|else|for|while|switch|case|break|continue|true|false|null|undefined)\b/g,
        (match) => saveToken(`<span class="text-amber-500 font-semibold">${match}</span>`)
      );
      // 5. Function calls
      processed = processed.replace(
        /\b([a-zA-Z0-9_]+)(?=\()/g,
        (match) => saveToken(`<span class="text-blue-500 dark:text-blue-400 font-medium">${match}</span>`)
      );
    } else if (lang === "json") {
      processed = processed.replace(/("[^"]*")(\s*:)/g, (_, p1, p2) =>
        `${saveToken(`<span class="text-blue-500 dark:text-blue-400 font-semibold">${p1}</span>`)}${p2}`
      );
      processed = processed.replace(/:(\s*)("[^"]*")/g, (_, p1, p2) =>
        `:${p1}${saveToken(`<span class="text-accent dark:text-teal-400 font-medium">${p2}</span>`)}`
      );
      processed = processed.replace(/:(\s*)(-?\d+\.?\d*)/g, (_, p1, p2) =>
        `:${p1}${saveToken(`<span class="text-violet-500 dark:text-violet-400">${p2}</span>`)}`
      );
      processed = processed.replace(/:(\s*)(true|false|null)/g, (_, p1, p2) =>
        `:${p1}${saveToken(`<span class="text-amber-500 font-semibold">${p2}</span>`)}`
      );
    } else if (lang === "bash" || lang === "sh" || lang === "shell") {
      processed = processed.replace(/(#.*$)/gm, (match) =>
        saveToken(`<span class="text-muted-foreground/60 italic">${match}</span>`)
      );
      processed = processed.replace(/("[^"]*"|'[^']*')/g, (match) =>
        saveToken(`<span class="text-accent dark:text-teal-400 font-medium">${match}</span>`)
      );
      processed = processed.replace(
        new RegExp("(^|[^a-zA-Z0-9_/-])(npm|pnpm|yarn|npx|git|curl|wget|cd|mkdir|rm|ls|cat|echo)\\b", "g"),
        (_, p1, p2) => `${p1}${saveToken(`<span class="text-violet-500 dark:text-violet-400 font-bold">${p2}</span>`)}`
      );
      processed = processed.replace(
        new RegExp("(^|[^a-zA-Z0-9_/-])(run|install|add|commit|push|pull|clone|checkout|init|build|dev)\\b", "g"),
        (_, p1, p2) => `${p1}${saveToken(`<span class="text-blue-500 dark:text-blue-400 font-medium">${p2}</span>`)}`
      );
      processed = processed.replace(/(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g, (match) =>
        saveToken(`<span class="text-amber-500 font-normal">${match}</span>`)
      );
    }

    tokens.forEach((html, i) => {
      processed = processed.replace(`___TOKEN_${i}___`, html);
    });

    return processed;
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
