# Ember

Ember is an intimate couples and lifestyle game app that helps partners connect more deeply through curated prompts, shared sessions, and streak-based engagement. It supports monogamous couples, ENM constellations, and lifestyle-curious groups of up to six people.

---

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Supabase CLI** (`npm install -g supabase`)
- **Turbo** (installed automatically via devDependencies)

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd Ember

# 2. Install all workspace dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in .env.local with your Supabase, Stripe, and other credentials

# 4. Start local Supabase (Postgres + Auth + Storage + Edge Functions)
supabase start

# 5. Run all apps and packages in development mode
pnpm dev
```

---

## Architecture Overview

```
Ember/
├── apps/
│   ├── web/          # Next.js 14 marketing + web app (App Router)
│   ├── mobile/       # Expo (React Native) iOS + Android app
│   └── admin/        # Next.js admin panel (internal use)
├── packages/
│   ├── lib/          # @ember/lib  — shared business logic, utilities, types
│   ├── db/           # @ember/db   — Supabase client, database types
│   ├── ui/           # @ember/ui   — shared design tokens
│   └── config/       # @ember/config — ESLint, Tailwind preset, tsconfigs
├── turbo.json        # Turborepo pipeline configuration
├── pnpm-workspace.yaml
└── .env.example
```

The monorepo is managed with **pnpm workspaces** and **Turborepo** for task orchestration and caching.

---

## Apps

### `apps/web`
Next.js 14 App Router application serving the web version of Ember and the marketing site. Uses server components, server actions, and Supabase SSR helpers.

### `apps/mobile`
Expo (React Native) application for iOS and Android. Uses Expo Router for file-based navigation. Shares all business logic from `@ember/lib` and database types from `@ember/db`.

### `apps/admin`
Internal Next.js admin panel for content management — seeding prompts, managing packs, reviewing audit logs, and monitoring subscriptions.

---

## Packages

### `@ember/lib`
Core business logic shared across all apps:
- **`constants.ts`** — `APP_NAME` and all app-wide constants (group size limits, push caps, quiet hours)
- **`identity.ts`** — Pronoun resolution, relationship structure labels, orientation/gender option lists
- **`schemas.ts`** — Zod validation schemas (profile, age gate, group creation, invite codes)
- **`prompt-engine.ts`** — Prompt eligibility filtering, token interpolation, weighted random selection
- **`entitlements.ts`** — Subscription tier resolution and feature gating
- **`notifications.ts`** — Notification payload builders for all notification kinds
- **`analytics.ts`** — Typed analytics event names and noop client
- **`i18n.ts`** — Locale resolution and localized prompt body helpers
- **`chat.ts`** — ROADMAP-B stub for Matrix community rooms
- **`toys.ts`** — ROADMAP-D stub for teledildonics integration

### `@ember/db`
Supabase database layer:
- **`types.ts`** — Hand-crafted TypeScript types for all database tables, with `Database` type for Supabase's generic client
- **`client.ts`** — `createSupabaseClient` factory typed against `Database`
- **`index.ts`** — Re-exports everything

### `@ember/ui`
Shared design tokens:
- **`tokens.ts`** — Colors, typography, spacing, and border radius constants

### `@ember/config`
Shared tooling configuration:
- **`eslint.js`** — ESLint flat config for TypeScript + React
- **`tailwind.js`** — Tailwind preset with Ember design tokens (primary `#E85A6B`, secondary `#1B1233`, accent `#F4C95D`)
- **`typescript/base.json`** — Strict base tsconfig
- **`typescript/nextjs.json`** — Next.js tsconfig extending base
- **`typescript/react-native.json`** — React Native tsconfig extending base

---

## Running Tasks

```bash
pnpm dev          # Start all apps in watch mode
pnpm build        # Build all packages and apps
pnpm lint         # Lint entire workspace
pnpm typecheck    # Type-check entire workspace
pnpm test         # Run all tests (Vitest)
pnpm format       # Format with Prettier
```

---

## Deployment

### Web + Admin — Vercel
Both `apps/web` and `apps/admin` are deployed to Vercel. Set all environment variables from `.env.example` in the Vercel project settings.

```bash
vercel --cwd apps/web
vercel --cwd apps/admin
```

### Mobile — EAS Build (Expo Application Services)
```bash
eas build --platform all --profile production
eas submit --platform all
```

Configure `eas.json` in `apps/mobile` with your Apple and Google credentials before running.

---

## Next Steps Checklist

- [ ] Create Stripe products and price IDs for `plus` and `household` tiers; add IDs to `.env.local`
- [ ] Configure Universal Links (iOS) and App Links (Android) for the `ember://` deep link scheme
- [ ] Run `eas build` to create initial development builds
- [ ] Populate prompts via the admin panel before launch (all prompts require `published: true`)
- [ ] Set up Supabase Row Level Security policies for all tables
- [ ] Configure PostHog project and add `POSTHOG_KEY` to environment
- [ ] Set up Sentry projects for web and mobile; add `SENTRY_DSN`
- [ ] Configure Resend sending domain and add `RESEND_API_KEY`
- [ ] Set up RevenueCat project for mobile IAP; add `REVENUECAT_SECRET`

---

## Community Rooms

**Planned v2 feature (ROADMAP-B).**

Community rooms will allow groups and lifestyle community members to join shared chat spaces. When this ships, group private rooms and lifestyle community rooms will use the **Matrix protocol** with end-to-end encryption via `matrix-js-sdk`. Event rooms will be created and managed from the admin panel.

See ROADMAP-B stubs in the codebase:
- `packages/lib/chat.ts` — `joinCommunityRoom`, `leaveCommunityRoom`, `sendCommunityMessage`
- `packages/db/types.ts` — `CommunityRoom` interface and `CommunityRoomKind` type
- `packages/db/types.ts` — `GroupSettings.community_room_id` (commented out)

---

## Toy Integration

**Planned v2 feature (ROADMAP-D).**

Toy integration will allow consenting adults to sync supported intimate devices with active sessions. The integration uses:
- **Lovense Standard API** ([developer.lovense.com](https://developer.lovense.com)) for Lovense devices
- **Buttplug.io** ([buttplug.io](https://buttplug.io)) abstraction layer covering 750+ devices from multiple manufacturers

Implementation will require:
- A Bluetooth native module (`expo-bluetooth` or `react-native-ble-plx`)
- A Lovense developer token
- A separate age-gated consent flow (distinct from the standard age gate)
- Platform-specific Bluetooth permission declarations in `app.json`

See ROADMAP-D stubs in the codebase:
- `packages/lib/toys.ts` — `connectToy`, `sendPattern`, `disconnectToy`
- `packages/db/types.ts` — `ToyConnection` interface and `ToyProvider` type
- `packages/db/types.ts` — `Session.toy_session_id` and `SessionCard.toy_pattern` (commented out)
- `packages/db/types.ts` — `GroupSettings.toy_sync_enabled` (commented out)

---

## License

MIT
