import { Article, Author } from "./types";

export const MOCK_AUTHORS: Record<"rounak" | "sarah" | "marcus", Author> = {
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

export const MOCK_FEATURED_ARTICLE: Article = {
  id: "featured-1",
  title: "Deep Dive into React 19 Server Actions and Transitions",
  slug: "react-19-server-actions-transitions-deep-dive",
  excerpt: "React 19 revolutionizes how we manage asynchronous operations and database mutations on the web. In this deep dive, we dissect the internal rendering lifecycle, async transition states, optimistic updates, and explore best architectural patterns to design bulletproof client-server state trees.",
  publishedAt: "May 25, 2026",
  readTime: "12 min read",
  category: "Core React",
  author: MOCK_AUTHORS.rounak,
  tags: ["React 19", "Server Components", "Performance"],
  content: `React 19 Server Actions and Transitions represent a major paradigm shift in modern web architecture. By integrating asynchronous database-mutations and server transitions directly into the React rendering engine, we can eliminate boilerplate fetch requests and loading toggles entirely.

In this deep technical breakdown, we analyze how actions operate under the hood, how concurrent transitions execute background reconciliations, and how to structure robust forms and optimistic state trees.

## The Async Lifecycle

Previously, managing asynchronous loading states, validation error callbacks, and cache updates required a combination of \`useState\`, \`useEffect\`, and third-party data fetching libraries. With Server Actions, async operations are integrated into the React runtime itself.

Here is how you write a basic React 19 Server Action:

\`\`\`typescript
"use server";

import { revalidatePath } from "next/cache";

export async function updateArticleBio(userId: string, bio: string) {
  try {
    // Database write action
    await db.user.update({
      where: { id: userId },
      data: { bio }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Validation failed" };
  }
}
\`\`\`

When integrating this into a Client Component, we can utilize \`useActionState\` to track execution states seamlessly without manual loaders:

\`\`\`typescript
"use client";

import { useActionState } from "react";
import { updateArticleBio } from "./actions";

export function BioForm({ userId }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const bio = formData.get("bio");
      return await updateArticleBio(userId, bio);
    },
    { success: false }
  );

  return (
    <form action={formAction} className="space-y-4">
      <textarea name="bio" required placeholder="Write your author bio..." />
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Save Bio"}
      </button>
      {state.error && <p className="text-destructive">{state.error}</p>}
    </form>
  );
}
\`\`\`

## Managing Form Actions

React 19 also introduces changes to form handling. The native HTML \`<form>\` element now accepts function references for the \`action\` attribute. When a function is passed to \`action\`, React automatically wraps it in a Transition context.

> [!NOTE]
> Transitions are background rendering tasks that do not block user input. This keeps the browser responsive even when extensive state reconciliations are happening on the main thread.

### Key Benefits of Transition Actions
- **Automatic Pending States**: No more manual \`setIsLoading(true)\` or \`setIsLoading(false)\` states.
- **Form Reset**: Forms automatically reset after action completions in non-controlled components.
- **Optimistic Updates**: Using \`useOptimistic\` to show immediate visual feedback while the server action processes in the background.

Let's look at how we can implement \`useOptimistic\` for instant state updates:

\`\`\`typescript
import { useOptimistic } from "react";

export function OptimisticPreview({ currentBio }) {
  const [optimisticBio, setOptimisticBio] = useOptimistic(
    currentBio,
    (state, newBio) => newBio
  );
  
  // Renders optimisticBio immediately on trigger
}
\`\`\`

## Concurrency and Fiber Reconciliations

Under the hood, when an action is triggered, React creates a new **Concurrent Transition**. This scheduler-level transition schedules a low-priority rendering sweep. While this sweep compiles in the background, high-priority interactions (like typing in another input or clicking a close button) bypass the background rendering entirely, maintaining a liquid-smooth 60fps interaction rate.

This completes our deep dive into React 19's Server Actions. By mastering Concurrent transitions and utilizing hook combinations like \`useActionState\` and \`useOptimistic\`, you can create extremely premium and fluid web applications.`,
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
    content: `Interaction to Next Paint (INP) is now a core ranking factor and Core Web Vital. Unlike First Input Delay (FID), which only measured the initial delay of the very first click, INP assesses the responsiveness of every single user interaction throughout the entire lifespan of the page.

In this performance-oriented article, we analyze the mechanical lifecycle of an interaction and how to yield blocking tasks to ensure low-latency responsiveness.

## Anatomy of an Interaction

When a user interacts with an element (e.g., clicking a button or pressing a keyboard key), the total time between the input and the subsequent visual frame rendering is composed of three distinct phases:

1.  **Input Delay**: The time between the user interaction and the execution of the event handler. This is primarily caused by main-thread blocking tasks.
2.  **Processing Time**: The time spent executing the event handler callbacks in JavaScript.
3.  **Presentation Delay**: The time required by the browser to recalculate layouts, style sheets, composite layers, and paint the next frame to the screen.

> [!IMPORTANT]
> To maintain a "Good" rating, your INP must stay under **200 milliseconds**. Anything above **500 milliseconds** is flagged as "Poor" and actively damages SEO ranking metrics.

## Diagnosing Main-Thread Blockers

To identify why your INP is high, we must open Chrome DevTools and capture a performance profile. Look for **Long Tasks** (tasks that exceed **50 milliseconds** in duration), highlighted with a red flag in the flame chart.

\`\`\`javascript
// A common culprit: executing heavy synchronous loops inside click events
button.addEventListener("click", () => {
  // Heavy synchronous blocking task
  const data = processHeavyDataset(dataset);
  renderResults(data);
});
\`\`\`

## Yielding Execution to the Main Thread

To solve processing lag, we can break up long JavaScript tasks into smaller asynchronous sub-tasks. This allows the browser's rendering engine to slot in style paints and handle other user inputs between tasks.

Here is how you write a clean, high-performance yielding schedule using the Scheduler API or \`setTimeout\` fallbacks:

\`\`\`typescript
// Helper utility to yield execution
function yieldToMain() {
  return new Promise((resolve) => {
    // If the browser supports scheduler.postTask, use it. Otherwise fallback.
    if ("scheduler" in window) {
      resolve(scheduler.postTask(() => {}, { priority: "background" }));
    } else {
      setTimeout(resolve, 0);
    }
  });
}

// Optimized event handler
async function handleButtonClick() {
  // 1. Process initial light updates
  showLoadingSpinner();
  
  // 2. Yield so the browser paints the loading spinner immediately
  await yieldToMain();
  
  // 3. Process heavy computation asynchronously
  const chunk1 = processChunk(data.slice(0, 1000));
  await yieldToMain(); // Yield again
  
  const chunk2 = processChunk(data.slice(1000, 2000));
  await yieldToMain();
  
  // 4. Render results
  renderFinalUI([chunk1, chunk2]);
}
\`\`\`

By yielding execution frequently, you can keep the main thread fluid and responsive, dropping your INP score from poor levels down to double-digit millisecond ranges!`,
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
    content: `As development organizations scale, maintaining a massive, single-container monolithic frontend codebase becomes highly inefficient. Teams block each other on releases, testing pipelines become bottlenecks, and dependency updates turn into high-risk events.

Enter **Micro-Frontends**—an architectural pattern that decouples the frontend into isolated, independently deployable mini-applications that are composed dynamically at runtime.

## Composition Strategies

There are three primary strategies for composing micro-frontends:

1.  **Build-Time Integration**: Decoupling code into npm packages. This is a false micro-frontend pattern as updating a single package requires rebuilding and deploying the entire host container.
2.  **Server-Side Composition**: Merging applications at the CDN or reverse-proxy level (e.g., using Tailwind, Edge Side Includes (ESI), or Next.js Multi-Zones). Highly performant but restricts client-side interaction speed.
3.  **Runtime Client-Side Composition**: Dynamically loading javascript entry bundles over the network. This is predominantly achieved via **Webpack Module Federation**.

## Implementing Module Federation

Webpack (and now Rsbuild/Vite) Module Federation allows an application to dynamically import compiled code from a separate host server at runtime.

Here is a standard configuration for a **Remote** app exposing a component:

\`\`\`javascript
// remote/webpack.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "auth_app",
      filename: "remoteEntry.js",
      exposes: {
        "./LoginForm": "./src/components/LoginForm.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
  ],
};
\`\`\`

And here is how the **Host** container imports the remote element dynamically in React:

\`\`\`typescript
import React, { lazy, Suspense } from "react";

// Load the federated login form component lazily
const RemoteLoginForm = lazy(() => import("auth_app/LoginForm"));

export function App() {
  return (
    <div className="container">
      <h1>Welcome to Host Application</h1>
      <Suspense fallback={<div>Loading Secure Portal...</div>}>
        <RemoteLoginForm />
      </Suspense>
    </div>
  );
}
\`\`\`

## Handling Style Encapsulation

When multiple applications load on the same page, CSS collisions are highly likely. To isolate styles cleanly, you must enforce specific constraints:
- **Tailwind Prefixing**: Add a unique prefix to all class names in each remote's config (e.g., \`prefix: 'auth-'\`).
- **CSS Modules**: Ensure component-level scoped styling is fully compiled into hashed selectors.
- **Shadow DOM**: Load micro-frontends inside isolated web component templates.

Micro-frontends represent an excellent path forward for enterprise-scale platforms, yielding isolated testing logs, independent deployment paths, and decoupled tech stacks.`,
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
    content: `For decades, web layouts have relied on global viewport dimensions via Media Queries (@media). While effective, this model breaks down in component-driven architectures. A component doesn't care how wide the screen is—it only cares about the size of the slot it occupies.

The introduction of **CSS Container Queries** and the relational pseudo-class **:has()** changes modern CSS layout patterns completely.

## The Power of Container Queries

Container queries allow us to query the dimensions of a specific parent container rather than the global screen viewport.

First, we must define a container context on the parent element:

\`\`\`css
/* Define container tracking */
.card-wrapper {
  container-type: inline-size;
  container-name: card-container;
}
\`\`\`

Once the parent is defined, we can target children elements dynamically based on parent sizing:

\`\`\`css
/* Styles apply only when parent card-wrapper is wider than 400px */
@container card-container (min-width: 400px) {
  .card-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
  }
}
\`\`\`

## Relational Power with :has()

The CSS \`:has()\` selector is often called the "parent selector" because it allows us to style an element based on its children or subsequent siblings. This introduces logical states in pure CSS without Javascript toggles.

Let's look at some powerful examples of \`:has()\` logic:

\`\`\`css
/* 1. Style a form fieldset parent if it contains an invalid input */
fieldset:has(input:invalid) {
  border-color: hsl(var(--destructive));
  background-color: hsla(var(--destructive), 0.05);
}

/* 2. Apply a dark overlay grid layout to the body if a mobile modal is open */
body:has(.modal-overlay[data-state="open"]) {
  overflow: hidden;
  filter: grayscale(0.2);
}

/* 3. Style cards depending on whether they contain an image */
.card-item:has(.card-image) {
  padding: 0;
  overflow: hidden;
}
\`\`\`

These core features are universally supported in modern browsers, enabling developers to write highly composable, zero-JS layout logic with ease!`,
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
    content: `Creating accessible web applications is a fundamental requirement of software engineering, not an optional visual Polish task. True accessibility (a11y) goes beyond simple image alt attributes—it requires meticulous focus control, keyboard accessibility, and robust semantic document outlines.

In this deep dive, we learn how to build accessible focus trap patterns, restore navigation focus, and satisfy strict WCAG guidelines.

## The Rule of Keyboard Focus

Any interactive component must be fully navigatable using only the \`Tab\` key. Standard interactive elements (like buttons, links, and forms) get keyboard focus by default. Custom components must utilize the \`tabindex\` attribute to receive focus.

- \`tabindex="0"\`: Places the element into the natural document tab sequence.
- \`tabindex="-1"\`: Removes the element from the tab sequence but allows it to receive programmatic focus via JavaScript (using \`element.focus()\`).

## Building a Bulletproof Focus Trap

When an interactive modal overlay opens, the keyboard focus must be locked inside that modal. If the user presses \`Tab\` on the very last focusable item in the modal, it must cycle back to the first. Focus must not leak back into background page links.

Here is a robust, lightweight helper function that establishes a programmatic focus trap inside a container:

\`\`\`typescript
export function trapFocus(container: HTMLElement) {
  const focusableSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) { // Shift + Tab (Backward)
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else { // Tab (Forward)
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown);
  
  // Return a cleanup function
  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}
\`\`\`

## Restoring Focus

A frequently omitted step in overlay architecture is focus restoration. When a user closes a modal, focus should return to the exact element that opened it. Without this restoration, keyboard focus gets reset to the top of the body, forcing keyboard users to tab through the entire page layout again.

\`\`\`typescript
// 1. Keep track of the active element that opened the overlay
const triggerElement = document.activeElement as HTMLElement;

// 2. Open overlay and trap focus
openModal();

// 3. When closing, programmatically restore focus
closeModal();
if (triggerElement) {
  triggerElement.focus();
}
\`\`\`

Enforcing focus management makes your web platforms highly accessible and extremely professional, delivering fluid navigation for keyboard and screen reader users alike.`,
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
    content: `For almost ten years, Webpack has been the undisputed backbone of modern JavaScript compilation. However, as web applications grew to hundreds of thousands of lines of code, Webpack's JavaScript-based compiler became extremely slow.

Today, a new class of **Next-Generation Bundlers** written in native compiled systems languages (like Rust and Go) are delivering compilation times that are orders of magnitude faster.

## The Architecture Competitors

Let's dissect the three primary challengers to Webpack:

1.  **Vite**: Created by Evan You, Vite avoids bundling entirely during development. It leverages native browser ES Modules (ESM) to load files dynamically on-demand, using **Esbuild** (written in Go) for pre-bundling dependencies.
2.  **Turbopack**: Designed by Vercel and the creator of Webpack (Tobias Koppers), Turbopack is written in Rust. It utilizes an incremental computation engine (the Turborepository architecture) to compile only the minimum required assets.
3.  **Rspack**: Built by ByteDance, Rspack is a Rust-based compiler designed as a drop-in replacement for Webpack. It is fully compatible with Webpack's massive loader/plugin ecosystem.

## Performance Benchmark Analysis

Compilation speeds vary dramatically depending on project complexity. On average, building a workspace with **5,000 components** yields the following performance ratios:

| Compiler | Cold Start (Dev) | Hot Module Reloading (HMR) | Production Build | Language |
| :--- | :--- | :--- | :--- | :--- |
| **Webpack** | 12.8s | 850ms | 45.2s | JavaScript |
| **Vite** | 1.1s | 40ms | 12.1s | Go / JS |
| **Turbopack**| 0.8s | 15ms | 8.4s | Rust |
| **Rspack** | 0.9s | 20ms | 6.2s | Rust |

## How Hot Module Reloading (HMR) Speeds Differ

Under Webpack, making a single style change requires the compiler to rebuild the module graph and bundle chunks, resulting in compile lags.

Vite resolves this by bypassing compilation entirely:

\`\`\`javascript
// Vite serves raw ESM. The browser requests individual files on-demand
// When a file edits, the server invalidates that specific module cache.
import { updateStyles } from "/src/components/Button.css?t=1684501";
\`\`\`

Rspack achieves similar speeds while retaining Webpack plugins by writing highly optimized concurrent Rust thread-pools to parse ASTs (Abstract Syntax Trees) in parallel.

Next-gen bundlers are saving hours of developer compilation wait times every week, representing a mandatory upgrade path for modern platforms.`,
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
    content: `When building interactive user interfaces like checkout wizards, multi-step authentication cards, or complex upload grids, we typically track states using arbitrary boolean flags: \`isLoading\`, \`isSuccess\`, \`hasErrors\`, and \`isEditable\`.

As features expand, these variables combine to form unmanageable states (e.g., how can both \`isLoading\` and \`isSuccess\` be true simultaneously?). This is known as **Boolean Explosion** and represents a primary source of UI bugs.

Model your component states as a **Finite State Machine (FSM)** to eliminate invalid states and construct robust interaction layouts.

## What is a Finite State Machine?

A Finite State Machine is a mathematical design pattern composed of:
1.  A finite set of **States** (e.g., \`idle\`, \`loading\`, \`success\`, \`error\`).
2.  A finite set of **Events** that trigger updates (e.g., \`SUBMIT\`, \`RESOLVE\`, \`RETRY\`).
3.  A **Transition** table defining state updates based on current state + event.
4.  An **Initial State**.

## Modeling a State Machine in React

We don't need heavy external libraries to benefit from state machines. We can model them using React's native \`useReducer\` hook.

Let's design a secure payment checkout workflow:

\`\`\`typescript
// 1. Define states and events
type State = "idle" | "submitting" | "confirmed" | "failed";
type Event = { type: "SUBMIT" } | { type: "RESOLVE" } | { type: "REJECT"; error: string } | { type: "RESET" };

// 2. Define the strict state transition map
const transitions: Record<State, Record<string, State>> = {
  idle: {
    SUBMIT: "submitting"
  },
  submitting: {
    RESOLVE: "confirmed",
    REJECT: "failed"
  },
  confirmed: {}, // Terminal state, no events allowed
  failed: {
    RESET: "idle"
  }
};

// 3. Create the reducer
function checkoutReducer(state: State, event: Event): State {
  const nextState = transitions[state]?.[event.type];
  // If the event is not defined for the current state, ignore it!
  return nextState || state;
}
\`\`\`

## Integrating into your React Component

Let's connect this state machine to our user interface:

\`\`\`typescript
import React, { useReducer } from "react";

export function PaymentPortal() {
  const [state, dispatch] = useReducer(checkoutReducer, "idle");

  async function handlePaymentSubmit() {
    dispatch({ type: "SUBMIT" });
    try {
      await executePaymentGateway();
      dispatch({ type: "RESOLVE" });
    } catch (err) {
      dispatch({ type: "REJECT", error: err.message });
    }
  }

  return (
    <div className="portal-card">
      {state === "idle" && (
        <button onClick={handlePaymentSubmit}>Pay Now</button>
      )}
      
      {state === "submitting" && (
        <p>Securing escrow transaction...</p>
      )}
      
      {state === "confirmed" && (
        <div className="success">Payment received! Enjoy your course.</div>
      )}
      
      {state === "failed" && (
        <div>
          <p>Transaction failed.</p>
          <button onClick={() => dispatch({ type: "RESET" })}>Try Again</button>
        </div>
      )}
    </div>
  );
}
\`\`\`

By enforcing a state transition map, we guarantee the component never gets stuck in multiple states at once, making interactive workflows completely bulletproof and extremely maintainable!`,
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
