# porto-nextjs-better-auth-drizzle Starter Kit 🚀

A production-ready starter kit for building full-stack dApps with Next.js 15, Porto web3 accounts, and Better Auth. Perfect for hackathons and MVPs that need passwordless authentication with wallet-based sign-in.

## 🎯 Key Features

- **Passwordless Authentication** - Sign in with Ethereum (SIWE) using Porto wallet connector
- **Type-Safe API** - End-to-end type safety with tRPC v11
- **Database Ready** - Drizzle ORM with Neon Postgres (serverless)
- **Modern Stack** - Next.js 15 with App Router, React 19, and TailwindCSS v4
- **Web3 Native** - Support for Base and Base Sepolia chains out of the box
- **Developer Experience** - Hot reload with Turbopack, TypeScript everywhere

## 🛠️ Tech Stack

### Frontend

- [Next.js 15.4](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS
- [Wagmi v2](https://wagmi.sh/) - React hooks for Ethereum
- [Porto](https://porto.xyz/) - Passwordless web3 accounts
- [Radix UI](https://www.radix-ui.com/) - Headless UI components

### Backend

- [tRPC v11](https://trpc.io/) - Type-safe API layer
- [Better Auth](https://better-auth.com/) - Authentication library with SIWE support
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Neon](https://neon.tech/) - Serverless Postgres

## 🚀 Quick Start

1. **Clone and install dependencies**

```bash
git clone https://github.com/your-repo/unite-defi-starter.git
cd unite-defi-starter
bun install
```

2. **Set up environment variables**

Copy `.env.example` to `.env` and configure:

```env
# Database (get your connection string from neon.tech)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Set up the database**

```bash
# Generate database migrations
bun db:generate

# Run migrations
bun db:migrate

# (Optional) Open Drizzle Studio to view your database
bun db:studio
```

4. **Start the development server**

```bash
bun dev
```

Open [https://localhost:3000](https://localhost:3000) - the app runs with HTTPS in development for secure wallet connections.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── trpc/          # tRPC endpoint
│   ├── dashboard/         # Protected dashboard page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── features/         # Feature components
│       └── PortoConnect.tsx  # Wallet connection component
├── config/               # Configuration files
│   └── wagmiConfig.ts    # Wagmi configuration
├── env/                  # Environment validation
│   ├── clientEnv.ts      # Client-side env vars
│   └── serverEnv.ts      # Server-side env vars
├── hooks/                # Custom React hooks
│   └── useSession.ts     # Session management hook
├── lib/                  # Utilities and helpers
│   ├── auth.ts          # Better Auth configuration
│   ├── auth-client.ts   # Auth client helpers
│   └── utils.ts         # General utilities
└── server/              # Server-side code
    ├── db/              # Database
    │   ├── schema.db.ts # Drizzle schema
    │   └── drizzle.ts   # Database client
    └── trpc/            # tRPC setup
        └── routers/     # API routers
```

## 🔐 Authentication Flow

1. User connects their Porto wallet
2. App requests a nonce from the server
3. User signs a SIWE message with their wallet
4. Server verifies the signature using Porto's server actions
5. Session is created and stored in the database
6. User is redirected to the dashboard

## 🛣️ API Routes

The tRPC router provides these endpoints:

- `hello` - Public endpoint for testing
- `profile` - Get authenticated user's profile
- `walletAddresses` - List connected wallet addresses
- `userStats` - Get user statistics
- `updateProfile` - Update user profile information

## 🎨 UI Components

This starter includes a set of reusable UI components from [shadcn/ui](https://ui.shadcn.com/):

- `Button` - Styled button component with variants
- `DropdownMenu` - Accessible dropdown menus
- Additional components can be added with the shadcn CLI

## 🔧 Development Commands

```bash
# Development
bun dev              # Start dev server with HTTPS & Turbopack

# Database
bun db:generate      # Generate migrations from schema changes
bun db:migrate       # Apply pending migrations
bun db:studio        # Open Drizzle Studio GUI

# Build & Deploy
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
bun format           # Format with Prettier
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This starter is optimized for serverless deployment but can run anywhere Node.js is supported:

- Railway
- Render
- Fly.io
- AWS Amplify
- Netlify

## 🔑 Environment Variables

| Variable              | Description                  | Required |
| --------------------- | ---------------------------- | -------- |
| `DATABASE_URL`        | PostgreSQL connection string | ✅       |
| `BETTER_AUTH_SECRET`  | Secret for signing sessions  | ✅       |
| `BETTER_AUTH_URL`     | Your app's URL               | ✅       |
| `NEXT_PUBLIC_APP_URL` | Public app URL               | ✅       |

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📚 Resources

- [Porto Documentation](https://docs.porto.xyz/) - Learn about Porto wallets
- [Better Auth Docs](https://better-auth.com/) - Authentication library docs
- [tRPC Documentation](https://trpc.io/) - Type-safe API development
- [Drizzle ORM Docs](https://orm.drizzle.team/) - Database ORM documentation
- [Wagmi Documentation](https://wagmi.sh/) - Ethereum React hooks

## 📝 License

MIT License - do whatever you want with this code!

---

Built with 💜 for the Unite DeFi Hackathon 2025
