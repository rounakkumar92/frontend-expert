# Vercel Deployment Guide — Frontend Expert

This guide provides step-by-step instructions for deploying the **Frontend Expert** application to **Vercel** with **Neon PostgreSQL** and **Prisma ORM**.

---

## 1. Prerequisites

Before deploying, ensure you have:
1. A **GitHub** repository containing your pushed codebase.
2. A **Vercel** account (free Hobby or Pro account).
3. A **Neon PostgreSQL** database project (provisioned at [neon.tech](https://neon.tech/)).

---

## 2. Environment Variables Checklist

Configure these environment variables in your Vercel Project Settings (**Settings → Environment Variables**):

| Variable Name | Description | Example / Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string (Pooled recommended) | `postgresql://user:pass@ep-cool-1234.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | 64+ character random string for session encryption | `generate-a-secure-64-char-hex-or-base64-secret-key` |
| `NODE_ENV` | Environment identifier | `production` |

> [!CAUTION]
> **Never commit your `.env` file or actual secret keys to GitHub.** Keep local secrets in `.env` (which is listed in `.gitignore`).

---

## 3. Vercel Project Configuration

When importing your GitHub repository into Vercel:

1. **Import Repository**: Click **Add New → Project** in Vercel and select your GitHub repo.
2. **Framework Preset**: Select **Next.js**.
3. **Root Directory**: Select `apps/web`.
4. **Build & Development Settings**:
   - **Build Command**: `pnpm run build` *(runs `prisma generate && next build` as configured in `apps/web/package.json`)*.
   - **Output Directory**: `.next` *(default)*.
   - **Install Command**: `pnpm install` *(default)*.
5. **Environment Variables**: Add `DATABASE_URL` and `JWT_SECRET`.
6. Click **Deploy**.

---

## 4. Database Setup & Initial Seeding

Since migrations have already been generated locally in `apps/web/prisma/migrations/`:

1. **Apply Migrations in Production**:
   To apply migrations directly to your Neon production database from your terminal:
   ```bash
   pnpm --filter web exec prisma migrate deploy
   ```

2. **Seed Initial Data**:
   To seed initial admin users (`admin@frontendexpert.com` / `adminpassword123`), categories, tags, and articles:
   ```bash
   pnpm --filter web exec prisma db seed
   ```

---

## 5. Continuous Deployment & Git Workflow

- **Main Branch (`main` / `master`)**: Pushing to the main branch automatically triggers a production deployment on Vercel.
- **Pull Requests**: Opening a pull request triggers a Vercel **Preview Deployment** with a unique staging URL for testing.
- **Prisma Client Generation**: The `postinstall` and `build` scripts in `apps/web/package.json` automatically generate the Prisma Client during Vercel's build phase.
