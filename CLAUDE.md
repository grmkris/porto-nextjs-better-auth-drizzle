# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with HTTPS and Turbopack
bun dev

# Build for production
bun build

# Run production server
bun start

# Run linter
bun lint

# Format code with Prettier
bun format

# Generate database migrations
bun db:generate

# Open Drizzle Studio for database management
bun db:studio
```

## Architecture Overview

This is a Next.js 15 application with the following key technologies:

**Frontend Stack:**
- Next.js 15.4.4 with App Router and Turbopack
- React 19.1.0 with TypeScript
- TailwindCSS v4 for styling with radix-ui components
- Wagmi v2 for Web3 integration with Porto wallet connector
- Support for Base and Base Sepolia chains

**Backend Stack:**
- tRPC v11 for type-safe API endpoints
- Drizzle ORM with PostgreSQL (Neon serverless)
- Server-side rendering with cookie-based state persistence

**Project Structure:**
- `/src/app` - Next.js App Router pages and API routes
  - `/src/app/trpc` - tRPC client-side setup
  - `/src/app/api/trpc/[trpc]` - tRPC API endpoint
- `/src/server` - Backend code
  - `/src/server/db` - Database schema and client
  - `/src/server/trpc` - tRPC server setup and routers
- `/src/components` - Reusable UI components
  - `/src/components/ui` - Base UI components (shadcn/ui)
  - `/src/components/features` - Feature-specific components
- `/src/lib` - Shared utilities
- `/src/config` - Configuration files (wagmi, drizzle)
- `/src/env` - Environment variable validation
- `/migrations` - Database migration files

**Key Patterns:**
- tRPC routers are defined in `/src/server/trpc/routers/_app.ts`
- Database schema uses Drizzle ORM in `/src/server/db/schema.db.ts`
- Environment variables are validated using `@t3-oss/env-nextjs`
- Client components use "use client" directive
- Server components can use `server-only` imports