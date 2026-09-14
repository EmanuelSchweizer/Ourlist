# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Ourlist — shared shopping lists with real-time sync. This repo is the Next.js
(App Router) frontend only; the backend is a separate ASP.NET Core (.NET 10) API
([ShoppingList_WebAPI](https://github.com/EmanuelSchweizer/ShoppingList_WebAPI.git)),
already deployed. Stack: TypeScript, HeroUI, Tailwind, NextAuth, Zustand, Jest.
Real-time sync (SignalR) is planned but not yet implemented on the frontend.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (`next.config.ts` sets `output: "standalone"`
  and `reactCompiler: true`)
- `npm run lint`
- `npm test` / `npm run test:watch`
- Single test file: `npx jest path/to/file.test.tsx`
- Single test by name: `npx jest -t "test name"`

## Env vars

`API_URL`, `BACKEND_API_KEY` (see `.env.example`), plus NextAuth's
`NEXTAUTH_SECRET`/`NEXTAUTH_URL` and `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`
for the Google provider.

## Architecture

Feature-based structure under `src/features/<domain>/` (`actions.ts`, `hooks/`,
`components/`, `types.ts`, optionally `store.ts`). `src/app/` is routing only —
no logic beyond `layout.tsx`/`error.tsx`/`loading.tsx`. Layout components may
import from features; features must never import from layout.

Three data-fetching paths, pick based on where the code runs:
- Initial page data: Server Component → `authFetch`/`serverFetch` directly.
- Form submit / mutation: Server Action (`features/*/actions.ts`) → `authFetch`.
- Client-side: components call the feature's actions/hooks/store, never the
  API client directly — it's server-only and importing it from a Client
  Component breaks the build.

### API client (`src/lib/server/api-client.ts`)

- Guarded with `import "server-only"` so a Client Component importing it fails
  the build instead of leaking `BACKEND_API_KEY` to the browser.
- `serverFetch` — no auth, used for login/signup/refresh.
- `authFetch` — reads the access token off the NextAuth JWT (via `getToken`)
  and delegates to `serverFetch`.
- 10s timeout via `AbortSignal.timeout` (Railway cold starts).
- A request that never reaches the backend throws `ApiError` with **status 0**
  — that's the convention for "no response received", not an HTTP status.
- Error bodies are read with `.text()`, not `.json()`, since ASP.NET error
  responses are sometimes HTML and `.json()` would mask the real error.
- 204 / empty bodies are special-cased (e.g. logout returns `NoContent`).

### Error handling (`src/lib/server/action.ts`)

Every server action is wrapped in `createAction(fn, fallbackMessage)` instead
of a per-action try/catch. It returns a discriminated union:
`{ success: true; data: T } | { success: false; message: string }`.
Callers check `result.success` — they do not try/catch, because Server
Actions don't serialize thrown exceptions to the client in production.
`parseErrorMessage` currently only understands a `{ message }` shape and
ASP.NET's `ValidationProblemDetails` (`{ errors: { Field: [...] } }`) shape;
other backend error shapes fall through to the action's fallback message.

### Auth (`src/features/auth/auth-options.ts`)

NextAuth with the JWT strategy. `accessToken`/`refreshToken` live only in the
JWT, never copied onto the `session` object — otherwise they'd be readable
client-side via `useSession()`. Refresh happens inside the `jwt` callback
(Server Components can't write cookies) and is driven by decoding the `exp`
claim from the JWT rather than a hardcoded TTL, with a 60s buffer before
treating a token as expired. The Google branch is gated on
`account?.provider === "google"`, not `!token.userId`, so `resolveOrCreateUser`
doesn't re-run on every request after a single failure.
`src/types/next-auth.d.ts` augments `Session`/`User`/`JWT` — it must keep its
`import "next-auth"` at the top or the file becomes a module declaration that
replaces those types instead of extending them; restart the TS server after
editing it.

`src/middleware.ts` protects everything except `/signIn`, `/signUp`,
`/api/auth/*`, and static assets. Paths listed in `SERVER_FETCH_PATHS`
(currently `/` and `/admin`) hit `/api/auth/session` first to force NextAuth's
own refresh logic to run and write a refreshed cookie, since `authFetch` reads
the JWT cookie directly and never triggers that refresh itself.

### State

Each feature that needs it has its own Zustand store (e.g.
`features/shoppingLists/store.ts`) holding server data fetched via that
feature's actions, plus small bits of UI state (e.g. `selectedListId`). There
is no separate query-cache library in this codebase — the store itself is the
source of truth for fetched data.

### UI

HeroUI components are only imported inside `src/components/ui/`; everywhere
else uses the local wrappers (`Button`, `Input`, `toast.ts` helpers, etc.) so
swapping the UI library later is a one-file change. The custom `Button`'s
prop for style variant is `intent`, not `variant` (HeroUI already owns that
name).

## Testing

Jest + React Testing Library, `jsdom` environment, config wrapped via
`next/jest`. `jest.config.ts` overrides `transformIgnorePatterns` after
`next/jest` builds it, because `next/jest` only appends to its default
ignore list and would otherwise keep blocking ESM packages
(`@heroui`, `@react-aria`, `@react-stately`, `@react-types`,
`@internationalized`) from being transformed. Path aliases
(`@/components`, `@/lib`, `@/types`, `@/store`, `@/features`) are mapped in
`jest.config.ts` and must mirror `tsconfig.json`. Manual mocks for
`next/navigation` and `next-auth/react` live in `__mocks__/`.

## Known gaps (see `src/docs/NOTES.md`)

- No request validation (e.g. Zod) in `createAction` — server actions are
  effectively public endpoints right now.
- Real-time sync (SignalR) is designed (room-per-user, permissions re-checked
  per broadcast) but not yet wired up on the frontend.
- `parseErrorMessage` doesn't cover every backend error shape.
