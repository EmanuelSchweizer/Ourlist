# Ourlist

Shared shopping lists with real-time sync. Create a list, share it with
someone, and both see changes as they happen.

> **Work in progress** — the backend API is complete and deployed.
> The frontend is under active development.

## Status

| | |
|---|---|
| Backend API | Complete, deployed on Railway |
| Auth (sign up, sign in, refresh) | Done |
| Admin panel | Done |
| Lists & items | Done |
| Real-time sync (SignalR) | Planned |

## Tech stack

Next.js (App Router), TypeScript, HeroUI, Tailwind, NextAuth, Zustand, Jest
Backend: [ShoppingList_WebAPI](https://github.com/EmanuelSchweizer/ShoppingList_WebAPI.git) —
ASP.NET Core (.NET 10), PostgreSQL, EF Core.

## Architecture

- Feature-based structure (`features/<domain>/` with `api`, `hooks`, `components`)
- Server-side data fetching; the API key never reaches the client
- Server Actions for mutations, typed result objects instead of thrown errors
