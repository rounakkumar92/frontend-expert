import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { NewsletterCTA } from "@/components/sections/NewsletterCTA";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow">
      {/* 1. Hero Section (Server Component) */}
      <HeroSection />

      {/* 2. Articles & Mock Simulation Grid (Client Component sub-tree) */}
      <ArticlesSection />

      {/* 3. Newsletter Subscription Panel (Server Component) */}
      <NewsletterCTA />
    </div>
  );
}

