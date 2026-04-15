# Neon Auth Next.js Starter

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="https://neon.com/brand/neon-logo-dark-color.svg">
	<source media="(prefers-color-scheme: light)" srcset="https://neon.com/brand/neon-logo-light-color.svg">
	<img width="250" alt="Neon Logo" src="https://neon.com/brand/neon-logo-dark-color.svg">
</picture>

### A simple authentication starter built with Next.js 16, Neon Auth, and shadcn/ui

Production-friendly starter focused on authentication flows, session inspection, token introspection, and protected API access.

---

This starter template demonstrates how to integrate Neon Auth in a real Next.js app with modern UI patterns and practical auth debugging pages. It is intentionally focused and minimal, so you can use it as a strong base before adding your own business logic.

## ✨ Key features

- Neon Auth integration for Next.js App Router
- Email and password sign in and sign up
- Email OTP sign in flow (send and verify)
- OAuth sign in with Google and GitHub
- Server-side and client-side session inspection
- Token viewer with JWT claim decoding
- Protected API route example with session validation
- Responsive app shell with sidebar and top navigation
- Dark mode support with keyboard toggle (press D)

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Auth: @neondatabase/auth
- UI: shadcn/ui + Radix primitives
- Styling: Tailwind CSS v4
- Icons: Lucide + React Icons

## 🚀 Get started

### Prerequisites

Before you start, you'll need:

1. A Neon account: https://console.neon.tech
2. A Neon project with Auth enabled
3. Node.js 18+ (Node.js 20+ recommended)
4. npm (or your preferred package manager)

### Initial setup

1. Clone the repository and install dependencies.

~~~bash
git clone https://github.com/dhanushreddy291/neon-auth-nextjs-starter.git
cd neon-auth-nextjs-starter
npm install
~~~

2. Create a .env file from the example.

~~~bash
cp .env.example .env
~~~

3. Add your Neon Auth environment variables.

~~~env
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
~~~

4. Start the development server.

~~~bash
npm run dev
~~~

5. Open http://localhost:3000.

### Configure Neon Auth

In Neon Console:

1. Open your project.
2. Go to Auth and enable it if needed.
3. Copy the Auth Base URL into NEON_AUTH_BASE_URL.
4. Configure your OAuth providers (Google, GitHub) with correct callback URLs (e.g., http://localhost:3000/api/auth/callback/google) and client IDs/secrets.

## ⚙️ How it works

### Authentication setup

This app uses Neon Auth with dedicated server and client helpers.

- Server-side auth is initialized in lib/auth/server.ts using createNeonAuth.
- Client-side auth is initialized in lib/auth/client.ts using createAuthClient.
- The catch-all auth route is exposed via app/api/auth/[...path]/route.ts.

### Sign-in flows

The login page supports multiple methods in one place:

- Email/password sign in
- Email/password sign up
- Email OTP (send code and verify)
- Google OAuth
- GitHub OAuth

Server actions handle email/password flows, while OTP and social sign in are performed client-side.

### Session and token debugging

- The Session page compares session data from client hooks and server components.
- The Tokens page shows the raw access token and decoded JWT claims.
- The Protected API page calls a secured endpoint to validate end-to-end auth.

### Protected API example

The API route at /api/profile checks auth.getSession() and:

- Returns user data when authenticated
- Returns 401 Unauthorized when no valid session exists

## 🧰 Development scripts

- npm run dev: Start local dev server with Turbopack
- npm run build: Build for production
- npm run start: Run production build
- npm run lint: Run ESLint
- npm run typecheck: Run TypeScript checks
- npm run format: Format TypeScript files with Prettier

## 📁 Project structure

~~~text
app/
	api/
		auth/[...path]/route.ts     # Neon Auth handler (GET/POST)
		profile/route.ts            # Protected API endpoint example
	login/
		actions.ts                  # Server actions for email/password auth
		page.tsx                    # UI for password, OTP, and OAuth flows
	protected-api/
		page.tsx                    # UI to test protected endpoint calls
	session/
		client-session.tsx          # Client-side session viewer
		page.tsx                    # Server/client session comparison page
	tokens/
		token-content.tsx           # Token rendering + clipboard helper
		page.tsx                    # Token and claims inspector
	layout.tsx                    # App shell, providers, sidebar, header
	page.tsx                      # Home dashboard

components/
	layout/                       # Sidebar, header, user nav
	ui/                           # shadcn/ui components

lib/
	auth/client.ts                # Neon auth client helper
	auth/server.ts                # Neon auth server helper

proxy.ts                        # Middleware route protection
~~~

Note: /tokens is protected using middleware in proxy.ts.

## 🧭 Route overview

- /: Auth dashboard and quick navigation
- /login: Sign in and sign up page (password, OTP, Google, GitHub)
- /session: Compare client vs server session data
- /tokens: Inspect access token and decoded JWT claims
- /protected-api: Test call to a protected endpoint
- /api/auth/[...path]: Neon Auth route handler
- /api/profile: Protected API example (requires authenticated session)

## 🚢 Deployment

When you're ready to deploy, use Vercel or any Node-compatible host.

Set these environment variables in production:

- NEON_AUTH_BASE_URL
- NEON_AUTH_COOKIE_SECRET

Also ensure:

1. Your production domain is allowed in Neon Auth settings.
2. OAuth provider callback URLs match your deployed domain.
3. You use a strong NEON_AUTH_COOKIE_SECRET in production.

## 🛠️ Troubleshooting

- OAuth returns to login without session:
	Check provider config and callback URL settings in Neon.

- OTP not received:
	Verify email OTP provider setup in Neon Auth and check spam folder.

- 401 from /api/profile:
	Sign in first and confirm session cookies are present.

- Auth errors in server actions:
	Confirm NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET are set correctly.

## 📚 Learn more

- Neon Auth overview: https://neon.com/docs/auth/overview
- Neon Auth with Next.js: https://neon.com/docs/auth/quick-start/nextjs-api-only
- Next.js docs: https://nextjs.org/docs
- shadcn/ui docs: https://ui.shadcn.com/docs
