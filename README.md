# Runera 2.0

Monorepo for the Runera running tracker app — a full-stack project with a REST API backend and a Next.js frontend.

Live: https://runera.vercel.app/

## Packages

| Package                              | Description                               |
| ------------------------------------ | ----------------------------------------- |
| [`apps/api`](apps/api)               | Express REST API with MongoDB             |
| [`apps/web`](apps/web)               | Next.js frontend                          |
| [`packages/shared`](packages/shared) | Shared TypeScript types used by both apps |

## Tech Stack

- **Package manager**: pnpm workspaces
- **API**: Node.js, Express 5, MongoDB + Mongoose, JWT auth
- **Web**: Next.js 16, React 19, TypeScript
- **Testing**: Jest, Supertest, MongoDB Memory Server

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 11+

### Install

```bash
pnpm install
```

### Environment variables

**`apps/api/.env`**

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/runners-db
TOKEN_KEY=your-secret-jwt-key-here
```

**`apps/web/.env.local`**

```env
NEXT_PUBLIC_API_BASE_URL=https://runners-api-lac.vercel.app/api/v1
```

## Scripts

Run from the monorepo root:

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `pnpm dev`      | Start both API and web in parallel |
| `pnpm dev:api`  | Start API only                     |
| `pnpm dev:web`  | Start web only                     |
| `pnpm test:api` | Run API tests                      |
| `pnpm build`    | Build all packages                 |

## Project Structure

```
apps/
  api/        Express API
  web/        Next.js frontend
packages/
  shared/     Shared types
```

## See Also

- [API docs](apps/api/API_DOCS.md)
- [API README](apps/api/README.md)
- [Web README](apps/web/README.md)
