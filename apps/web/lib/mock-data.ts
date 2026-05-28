import { Article, Author } from "./types";

export const MOCK_AUTHORS: Record<"rounak" | "sarah" | "marcus", Author> = {
  rounak: {
    name: "Rounak Sharma",
    avatarUrl: "", // Falls back to first letter circle
    role: "Core Systems Engineer",
  },
  sarah: {
    name: "Sarah Jenkins",
    avatarUrl: "",
    role: "Web Performance Analyst",
  },
  marcus: {
    name: "Marcus Aurelius",
    avatarUrl: "",
    role: "Principal Frontend Architect",
  },
};

export const MOCK_FEATURED_ARTICLE: Article = {
  id: "featured-1",
  title: "Deep Dive into React 19 Server Actions and Transitions",
  slug: "react-19-server-actions-transitions-deep-dive",
  excerpt: "React 19 revolutionizes how we manage asynchronous operations and database-mutations on the web. In this deep dive, we dissect the internal rendering lifecycle, async transition states, optimistic updates, and explore best architectural patterns to design bulletproof client-server state trees.",
  publishedAt: "May 25, 2026",
  readTime: "12 min read",
  category: "Core React",
  author: MOCK_AUTHORS.rounak,
  tags: ["React 19", "Server Components", "Performance"],
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "The Cost of JavaScript: Optimizing Interaction to Next Paint (INP)",
    slug: "optimizing-interaction-to-next-paint-inp",
    excerpt: "Interaction to Next Paint (INP) is now an official Core Web Vital. Learn how to diagnose main-thread bottlenecks, profile blocking tasks in Chrome DevTools, optimize complex event handlers, and implement scheduler yield schedules to keep your interactive UI liquid smooth.",
    publishedAt: "May 18, 2026",
    readTime: "9 min read",
    category: "Performance",
    author: MOCK_AUTHORS.sarah,
    tags: ["Performance", "Web Vitals", "DevTools"],
  },
  {
    id: "art-2",
    title: "Designing a Modern Micro-Frontend Architecture",
    slug: "designing-modern-micro-frontend-architecture",
    excerpt: "Scale your development organization by decoupling massive monorepos. We analyze runtime module federation mechanics, clean script sandbox engines, sandboxed styling patterns, and robust cross-iframe state synchronizations.",
    publishedAt: "May 10, 2026",
    readTime: "14 min read",
    category: "Architecture",
    author: MOCK_AUTHORS.marcus,
    tags: ["Architecture", "Scale", "System Design"],
  },
  {
    id: "art-3",
    title: "Mastering CSS Container Queries and :has() Selector Logic",
    slug: "mastering-css-container-queries-has-selector",
    excerpt: "CSS container queries and the relational pseudo-class :has() are rewriting responsive design books. See how to construct truly component-driven layouts, optimize parent styles, and completely bypass heavy ResizeObservers.",
    publishedAt: "May 02, 2026",
    readTime: "7 min read",
    category: "CSS & Design",
    author: MOCK_AUTHORS.sarah,
    tags: ["CSS", "Design Systems", "Web Standards"],
  },
  {
    id: "art-4",
    title: "A Pragmatic Guide to Web Accessibility (a11y) & Focus Management",
    slug: "web-accessibility-a11y-focus-management",
    excerpt: "Building accessible interfaces is more than just passing automated color checkers. Learn the design mathematics behind focus traps, robust modal restoration trees, and custom semantic ARIA keyboard maps.",
    publishedAt: "Apr 24, 2026",
    readTime: "10 min read",
    category: "Accessibility",
    author: MOCK_AUTHORS.rounak,
    tags: ["a11y", "Accessibility", "JavaScript"],
  },
  {
    id: "art-5",
    title: "Next-Gen Bundlers: Turbopack vs. Vite vs. Rspack",
    slug: "next-gen-bundlers-turbopack-vite-rspack",
    excerpt: "Webpack's decade-long reign is ending. We compare modern compiler designs, rust-based build pipelines, aggressive tree-shaking patterns, and hot module reloading speeds in massive industrial applications.",
    publishedAt: "Apr 15, 2026",
    readTime: "11 min read",
    category: "Build Tools",
    author: MOCK_AUTHORS.marcus,
    tags: ["Build Tools", "Rust", "Vite"],
  },
  {
    id: "art-6",
    title: "State Machines in React: Building Bulletproof Workflows",
    slug: "state-machines-react-bulletproof-workflows",
    excerpt: "Complex checkouts and multi-step UI flows can quickly turn into unmaintainable nested boolean tangles. Learn how to model your application state as formal finite automata (FSM) to eliminate invalid UI states entirely.",
    publishedAt: "Apr 05, 2026",
    readTime: "8 min read",
    category: "State Management",
    author: MOCK_AUTHORS.rounak,
    tags: ["State Management", "React", "Design Patterns"],
  },
];

export const MOCK_TRENDING_TAGS = [
  "React 19",
  "Performance",
  "Architecture",
  "CSS",
  "a11y",
  "Build Tools",
  "State Management",
  "Web Vitals",
  "Rust",
];
