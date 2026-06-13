import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";

// Helper to slugify heading text for table of contents anchors
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Custom MDX component mappings to replace default elements with premium UI components
const mdxComponents = {
  // Allow direct usage of Callout in MDX files
  Callout,

  // Custom headings with auto-generated anchor IDs for the Table of Contents
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = String(children || "");
    return (
      <h1 {...props} id={slugify(text)} className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-10 mb-4 border-b border-border/40 pb-2">
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = String(children || "");
    return (
      <h2 {...props} id={slugify(text)} className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-8 mb-4 border-b border-border/20 pb-2 scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = String(children || "");
    return (
      <h3 {...props} id={slugify(text)} className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mt-6 mb-3 scroll-mt-20">
        {children}
      </h3>
    );
  },

  // Layout element overrides
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="text-[15px] sm:text-base text-muted-foreground/90 leading-relaxed sm:leading-loose mb-5 font-normal" />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc pl-6 my-4 space-y-2 text-muted-foreground leading-relaxed marker:text-primary" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-6 my-4 space-y-2 text-muted-foreground leading-relaxed marker:text-primary" />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="leading-relaxed text-muted-foreground" />
  ),

  // Override standard blockquotes or GitHub formatted alert blocks (> [!NOTE], etc.)
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => {
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0];

    if (React.isValidElement(firstChild)) {
      const firstChildProps = firstChild.props as any;
      let textContent = "";

      if (Array.isArray(firstChildProps.children)) {
        const first = firstChildProps.children[0];
        if (typeof first === "string") {
          textContent = first;
        }
      } else if (typeof firstChildProps.children === "string") {
        textContent = firstChildProps.children;
      }

      if (textContent) {
        let type: "info" | "tip" | "warning" | "important" | null = null;
        let prefix = "";

        if (textContent.startsWith("[!NOTE]")) {
          type = "info";
          prefix = "[!NOTE]";
        } else if (textContent.startsWith("[!TIP]")) {
          type = "tip";
          prefix = "[!TIP]";
        } else if (textContent.startsWith("[!WARNING]")) {
          type = "warning";
          prefix = "[!WARNING]";
        } else if (textContent.startsWith("[!IMPORTANT]")) {
          type = "important";
          prefix = "[!IMPORTANT]";
        }

        if (type) {
          const remainingChildren = Array.isArray(firstChildProps.children)
            ? [firstChildProps.children[0].replace(prefix, "").trim(), ...firstChildProps.children.slice(1)]
            : firstChildProps.children.replace(prefix, "").trim();

          return <Callout type={type}>{remainingChildren}</Callout>;
        }
      }
    }

    return (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground/90 bg-muted/20 py-2 pr-4 rounded-r-lg">
        {children}
      </blockquote>
    );
  },

  // Map Markdown pre/code tags to our premium custom CodeBlock component
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    if (React.isValidElement(children) && children.type === "code") {
      const codeProps = children.props as React.HTMLAttributes<HTMLElement> & {
        children: string;
        className?: string;
        filename?: string;
        title?: string;
        metastring?: string;
      };

      const langClass = codeProps.className || "";
      const language = langClass.replace("language-", "") || "typescript";
      const code = String(codeProps.children || "").trim();

      // Extract filename from attributes or metastring
      let filename = codeProps.filename || codeProps.title || "";
      const metastring = codeProps.metastring || "";
      if (!filename && metastring) {
        const match = metastring.match(/filename="([^"]+)"/) || metastring.match(/title="([^"]+)"/);
        if (match && match[1]) {
          filename = match[1];
        } else {
          // Fallback parsing for raw space-separated names (e.g. ```typescript index.ts)
          const parts = metastring.split(" ");
          for (const part of parts) {
            if (part.includes(".")) {
              filename = part;
              break;
            }
          }
        }
      }

      return <CodeBlock code={code} language={language} filename={filename} />;
    }

    return <pre>{children}</pre>;
  },

  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className="px-1.5 py-0.5 rounded bg-muted font-mono text-[13px] font-semibold text-primary border border-border/40" />
  ),
};

interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote source={content} components={mdxComponents} />
    </div>
  );
}
