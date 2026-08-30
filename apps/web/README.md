# Runera Web

Frontend app for tracking and managing runs. Built with Next.js and React.

Live: https://runera.vercel.app/

## Core Features

- Authentication flow (sign up, log in, protected user routes)
- Personal dashboard and user info page
- Run tracking: create, view, edit, and delete runs
- Run form with pace preview, weather tags, effort level, and notes
- Profile editing (name, date of birth, height, weight)

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19
- **Language**: TypeScript
- **Shared types**: `@runera/shared` workspace package

## Setup

> From the monorepo root, dependencies are managed with pnpm workspaces. Run setup from the root unless working on this app in isolation.

1. Install dependencies (from monorepo root):
   ```bash
   pnpm install
   ```
2. Create a `.env.local` file in `apps/web/`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://runners-api-lac.vercel.app/api/v1
   ```
3. Start the dev server:
   ```bash
   pnpm dev:web
   ```
   Or from within `apps/web/`:
   ```bash
   pnpm dev
   ```

## Scripts

- `pnpm dev` — Start development server (http://localhost:3000)
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
