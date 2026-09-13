import React from "react";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, FileText, FolderOpen, Tags, Users } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AdminLogoutButton } from "@/components/layout/AdminLogoutButton";
import { LogoIcon } from "@/components/brand/Logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  // If there's no session, we're likely on the login page (or middleware will redirect us).
  // In either case, we render a minimal layout without sidebar.
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/10 backdrop-blur-sm flex flex-col shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/80">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <LogoIcon size={26} className="group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-sm text-foreground tracking-tight">
              Publishing<span className="text-primary ml-1 font-bold">Desk</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <LayoutDashboard className="h-4 w-4 text-primary/70" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            href="/admin/articles"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <FileText className="h-4 w-4 text-primary/70" />
            <span>Articles</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <FolderOpen className="h-4 w-4 text-primary/70" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/tags"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <Tags className="h-4 w-4 text-primary/70" />
            <span>Tags</span>
          </Link>

          {session.role === "ADMIN" && (
            <Link
              href="/admin/authors"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            >
              <Users className="h-4 w-4 text-primary/70" />
              <span>Authors & Roles</span>
            </Link>
          )}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-border bg-card/20 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-3 overflow-hidden min-w-0">
            {session.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.avatarUrl}
                alt={session.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                {session.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-bold text-foreground truncate">{session.name}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mt-0.5">
                {session.role}
              </div>
            </div>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/5 backdrop-blur-sm flex items-center justify-end px-8 md:hidden">
          <Link href="/admin" className="mr-auto font-extrabold text-sm text-foreground tracking-tight">
            FE Desk
          </Link>
          <ThemeToggle />
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
