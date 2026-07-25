import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing database records
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});

  // 2. Create Users (Authors & Admins)
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("adminpassword123", salt);
  const authorPassword = await bcrypt.hash("authorpassword123", salt);

  const admin = await prisma.user.create({
    data: {
      email: "admin@frontendexpert.com",
      name: "Alex Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      bio: "Lead Administrator and Systems Architect for Frontend Expert.",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
  });

  const author = await prisma.user.create({
    data: {
      email: "author@frontendexpert.com",
      name: "Sarah Author",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      bio: "Senior Frontend Engineer specializing in Web Accessibility and React Performance.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
  });

  console.log("Users created:", { admin: admin.email, author: author.email });

  // 3. Create Categories
  const catArch = await prisma.category.create({
    data: { name: "Architecture", slug: "architecture" },
  });
  const catA11y = await prisma.category.create({
    data: { name: "Accessibility", slug: "accessibility" },
  });
  await prisma.category.create({
    data: { name: "Performance", slug: "performance" },
  });
  const catCSS = await prisma.category.create({
    data: { name: "CSS", slug: "css" },
  });

  console.log("Categories created");

  // 4. Create Tags
  const tagReact = await prisma.tag.create({
    data: { name: "React", slug: "react" },
  });
  const tagNext = await prisma.tag.create({
    data: { name: "Next.js", slug: "nextjs" },
  });
  const tagA11y = await prisma.tag.create({
    data: { name: "A11y", slug: "a11y" },
  });
  const tagCSS = await prisma.tag.create({
    data: { name: "CSS Grid", slug: "css-grid" },
  });

  console.log("Tags created");

  // 5. Create Articles
  // Published article
  await prisma.article.create({
    data: {
      title: "Designing Modern Micro-Frontend Architecture",
      slug: "designing-modern-micro-frontend-architecture",
      excerpt: "An in-depth guide to decoupling massive frontend applications using module federation, isolation patterns, and shared design systems.",
      content: `Micro-frontends extend the concepts of microservices to the frontend world. Instead of building a monolithic frontend application, you split your system into multiple autonomous micro-apps that can be developed, tested, and deployed independently.

## Core Isolation Patterns

To succeed with micro-frontends, you must ensure strict isolation between apps:
1. **DOM Isolation**: Wrap applications inside Web Components and Shadow DOM to prevent CSS leaks.
2. **State Isolation**: Use postMessage or localized context buses instead of a single global store.
3. **Build Independence**: Ensure every team can deploy their app without running a complete monorepo build pipeline.

Let's look at a simple iframe isolation pattern or custom element container.`,
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
      readTime: "8 min read",
      authorId: author.id,
      categoryId: catArch.id,
      tags: {
        connect: [{ id: tagReact.id }, { id: tagNext.id }],
      },
    },
  });

  // Draft article
  await prisma.article.create({
    data: {
      title: "Deep Dive into CSS Grid Layout",
      slug: "deep-dive-into-css-grid-layout",
      excerpt: "Master CSS Grid with hands-on examples, template areas, and advanced responsive auto-fit structures.",
      content: `CSS Grid is a layout system designed for two-dimensional grids. Grid manages rows and columns simultaneously.

## Key Properties

- \`grid-template-columns\`
- \`grid-template-rows\`
- \`grid-template-areas\`

Stay tuned for the full walkthrough once this draft is finished!`,
      status: ArticleStatus.DRAFT,
      readTime: "5 min read",
      authorId: admin.id,
      categoryId: catCSS.id,
      tags: {
        connect: [{ id: tagCSS.id }],
      },
    },
  });

  // Scheduled article
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 7);

  await prisma.article.create({
    data: {
      title: "Building an Accessible Focus Trap in React",
      slug: "building-an-accessible-focus-trap-in-react",
      excerpt: "A step-by-step tutorial on implementing keyboard navigation traps for modals and dialog components under WCAG AA standards.",
      content: `A focus trap restricts keyboard focus navigation (Tab and Shift+Tab) to a specific DOM subtree. This is crucial for modal accessibility.

## Keyboard Trap Requirements

1. **Trap focus**: Ensure user cannot tab outside the modal context.
2. **Escape key**: Listen to Escape key events and close the container.
3. **Restore focus**: Shift focus back to the triggering element once modal is closed.

This article is scheduled to publish on: ${scheduledDate.toLocaleDateString()}.`,
      status: ArticleStatus.SCHEDULED,
      publishedAt: scheduledDate,
      readTime: "6 min read",
      authorId: author.id,
      categoryId: catA11y.id,
      tags: {
        connect: [{ id: tagReact.id }, { id: tagA11y.id }],
      },
    },
  });

  console.log("Seeding complete successfully! 🌱");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
