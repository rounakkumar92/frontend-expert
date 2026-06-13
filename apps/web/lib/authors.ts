import { Author } from "./types";

export const AUTHORS: Record<"rounak" | "sarah" | "marcus" | string, Author> = {
  rounak: {
    name: "Rounak Sharma",
    avatarUrl: "", // Falls back to first letter circle
    role: "Core Systems Engineer",
    bio: "Core Systems Engineer specializing in React internals, compiler design, and rendering performance. Passionate about building developer tools and highly optimized user interfaces.",
  },
  sarah: {
    name: "Sarah Jenkins",
    avatarUrl: "",
    role: "Web Performance Analyst",
    bio: "Web Performance Analyst dedicated to diagnosing main-thread latency, optimizing Core Web Vitals, and lecturing globally on modern rendering cycles and yield scheduling.",
  },
  marcus: {
    name: "Marcus Aurelius",
    avatarUrl: "",
    role: "Principal Frontend Architect",
    bio: "Principal Frontend Architect with a decade of engineering experience building module federation systems, isolated state architectures, and scalable monorepo tooling.",
  },
};
