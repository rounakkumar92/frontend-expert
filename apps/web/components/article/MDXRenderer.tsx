import React from "react";
import { CodeBlock } from "./CodeBlock";
import { Info, AlertTriangle, Sparkles } from "lucide-react";

interface MDXRendererProps {
  content: string;
}

// Helper to slugify heading text for table of contents anchors
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  
  let currentBlockType: "paragraph" | "code" | "list" | "blockquote" | null = null;
  let codeLines: string[] = [];
  let codeLang = "typescript";
  let listItems: string[] = [];
  let blockquoteLines: string[] = [];

  // Helper to parse bold, italic, and inline code markers into react nodes safely
  const parseInline = (text: string) => {
    // Escape HTML entities to prevent rendering issues
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace bold (**text**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    
    // Replace italic (*text*)
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    
    // Replace inline code (`code`)
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-[13px] font-semibold text-primary border border-border/40">$1</code>'
    );

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const flushCurrentBlock = (index: number) => {
    if (!currentBlockType) return;

    if (currentBlockType === "code") {
      blocks.push(
        <CodeBlock
          key={`code-${index}`}
          code={codeLines.join("\n")}
          language={codeLang}
        />
      );
      codeLines = [];
    } else if (currentBlockType === "list") {
      blocks.push(
        <ul key={`list-${index}`} className="list-disc pl-6 my-4 space-y-2 text-muted-foreground leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="marker:text-primary">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    } else if (currentBlockType === "blockquote") {
      const fullText = blockquoteLines.join(" ");
      let isAlert = false;
      let alertType: "note" | "important" | "warning" = "note";
      let alertContent = fullText;

      // Check for GitHub style alert tags
      if (fullText.startsWith("[!NOTE]")) {
        isAlert = true;
        alertType = "note";
        alertContent = fullText.replace("[!NOTE]", "").trim();
      } else if (fullText.startsWith("[!IMPORTANT]")) {
        isAlert = true;
        alertType = "important";
        alertContent = fullText.replace("[!IMPORTANT]", "").trim();
      } else if (fullText.startsWith("[!WARNING]")) {
        isAlert = true;
        alertType = "warning";
        alertContent = fullText.replace("[!WARNING]", "").trim();
      }

      if (isAlert) {
        const borderCls =
          alertType === "important"
            ? "border-accent bg-accent/5 text-foreground"
            : alertType === "warning"
            ? "border-destructive bg-destructive/5 text-foreground"
            : "border-primary bg-primary/5 text-foreground";
            
        const Icon =
          alertType === "important"
            ? Sparkles
            : alertType === "warning"
            ? AlertTriangle
            : Info;

        blocks.push(
          <div
            key={`alert-${index}`}
            className={`my-6 flex items-start gap-4 rounded-xl border p-5 glass ${borderCls}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
            <div className="text-sm leading-relaxed font-medium">
              {parseInline(alertContent)}
            </div>
          </div>
        );
      } else {
        blocks.push(
          <blockquote
            key={`quote-${index}`}
            className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground/90 bg-muted/20 py-2 pr-4 rounded-r-lg"
          >
            <p className="leading-relaxed text-sm">{parseInline(fullText)}</p>
          </blockquote>
        );
      }
      blockquoteLines = [];
    }
    
    currentBlockType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // 1. Inside a code block, collect lines until closing ```
    if (currentBlockType === "code") {
      if (trimmed.startsWith("```")) {
        flushCurrentBlock(i);
      } else {
        codeLines.push(line);
      }
      continue;
    }

    // 2. Detect opening of a code block
    if (trimmed.startsWith("```")) {
      flushCurrentBlock(i);
      currentBlockType = "code";
      codeLang = trimmed.replace("```", "").trim() || "typescript";
      continue;
    }

    // 3. Detect lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (currentBlockType !== "list") {
        flushCurrentBlock(i);
        currentBlockType = "list";
      }
      listItems.push(trimmed.substring(2));
      continue;
    }

    // 4. Detect blockquotes
    if (trimmed.startsWith("> ")) {
      if (currentBlockType !== "blockquote") {
        flushCurrentBlock(i);
        currentBlockType = "blockquote";
      }
      blockquoteLines.push(trimmed.substring(2));
      continue;
    }

    // 5. Detect empty lines
    if (trimmed === "") {
      if (currentBlockType === "list" || currentBlockType === "blockquote") {
        flushCurrentBlock(i);
      }
      continue;
    }

    // 6. Detect Headings
    if (trimmed.startsWith("# ")) {
      flushCurrentBlock(i);
      const text = trimmed.substring(2);
      blocks.push(
        <h1 key={`h1-${i}`} id={slugify(text)} className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-10 mb-4 border-b border-border/40 pb-2">
          {text}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushCurrentBlock(i);
      const text = trimmed.substring(3);
      blocks.push(
        <h2 key={`h2-${i}`} id={slugify(text)} className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-8 mb-4 border-b border-border/20 pb-2 scroll-mt-20">
          {text}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushCurrentBlock(i);
      const text = trimmed.substring(4);
      blocks.push(
        <h3 key={`h3-${i}`} id={slugify(text)} className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mt-6 mb-3 scroll-mt-20">
          {text}
        </h3>
      );
      continue;
    }

    // 7. General text block (Paragraph) — flush any open block first,
    // then emit a standalone <p>. We don't track "paragraph" as a block
    // type to avoid impossible-comparison narrowing in strict mode.
    flushCurrentBlock(i);

    blocks.push(
      <p key={`p-${i}`} className="text-[15px] sm:text-base text-muted-foreground/90 leading-relaxed sm:leading-loose mb-5 font-normal">
        {parseInline(trimmed)}
      </p>
    );
  }

  // Flush remaining elements
  flushCurrentBlock(lines.length);

  return <div className="prose prose-zinc dark:prose-invert max-w-none">{blocks}</div>;
}
