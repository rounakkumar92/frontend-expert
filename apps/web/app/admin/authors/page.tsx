"use client";

import React, { useState, useEffect } from "react";
import { Plus, AlertCircle, Loader2, Mail } from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AUTHOR" | "READER";
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    articles: number;
  };
}

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "AUTHOR" | "READER">("AUTHOR");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        throw new Error("Access Denied: Administrator role is required.");
      }
      if (!res.ok) throw new Error("Failed to load authors list.");
      const data = await res.json();
      setAuthors(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          bio: bio || null,
          avatarUrl: avatarUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      // Success
      setName("");
      setEmail("");
      setPassword("");
      setRole("AUTHOR");
      setBio("");
      setAvatarUrl("");
      fetchAuthors(); // Refresh
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error && error.includes("Access Denied")) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h2 className="text-base font-extrabold text-foreground">Permission Required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are currently signed in with insufficient privileges. Only Administrators can view or manage users and author profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Authors & Roles
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage administrative permissions, roles, and profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Authors List (2/3 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/40 p-6 glass space-y-4">
          <h2 className="text-sm font-bold text-foreground">Registered Users</h2>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Loading accounts...</span>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {authors.map((author) => (
                <div key={author.id} className="py-4 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={author.avatarUrl}
                        alt={author.name}
                        className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
                        {author.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground truncate">{author.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                            author.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                              : author.role === "AUTHOR"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {author.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span>{author.email}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-muted/60 text-muted-foreground border border-border/40 text-[10px] font-bold shrink-0">
                    {author._count.articles} publications
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Create User Form (1/3 columns) */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 glass space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Add New User</h2>
            <p className="text-[10px] text-muted-foreground">
              Provision credentials and profile information.
            </p>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-muted-foreground">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-muted-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pass" className="text-xs font-bold text-muted-foreground">
                Initial Password
              </label>
              <input
                id="pass"
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-bold text-muted-foreground">
                Role Permissions
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "AUTHOR" | "READER")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="AUTHOR">Author</option>
                <option value="ADMIN">Administrator</option>
                <option value="READER">Reader</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-xs font-bold text-muted-foreground">
                Biography (Optional)
              </label>
              <textarea
                id="bio"
                rows={2}
                placeholder="Write a brief profile description..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="avatar" className="text-xs font-bold text-muted-foreground">
                Avatar Image URL (Optional)
              </label>
              <input
                id="avatar"
                type="url"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2.5 text-xs font-bold shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Create User</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
