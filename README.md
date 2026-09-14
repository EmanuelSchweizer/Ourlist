# Ourlist

Shared shopping lists with real-time sync. Create a list, share it with
someone, and both see changes as they happen.

> **Work in progress** — the backend API is complete and deployed.
> The frontend is under active development.

## Features

- **Lists & items** — create, rename, and delete lists (with confirmation);
  add, check off, and remove items
- **Sharing** — share a list with other users by email and manage
  participants (add/remove) from a dedicated modal
- **Activity feed** — a per-list, per-day log of who added or bought which
  items
- **Purchase chart** — a donut chart breaking down bought vs. remaining
  items per participant
- **Auth** — sign up, sign in (credentials or Google), automatic token
  refresh
- **Admin panel** — manage users (edit, update password, delete)

## Status

| | |
|---|---|
| Backend API | Complete, deployed on Railway |
| Auth (sign up, sign in, refresh) | Done |
| Admin panel | Done |
| Lists & items | Done |
| List sharing & participants | Done |
| Activity feed & purchase chart | Done |
| Real-time sync (SignalR) | Planned |

## Tech stack

Next.js (App Router), TypeScript, HeroUI, Tailwind, NextAuth, Zustand, Jest
Backend: [ShoppingList_WebAPI](https://github.com/EmanuelSchweizer/ShoppingList_WebAPI.git) —
ASP.NET Core (.NET 10), PostgreSQL, EF Core.

## Architecture

- Feature-based structure (`features/<domain>/` with `actions.ts`, `hooks`, `components`)
- Server-side data fetching; the API key never reaches the client
- Server Actions for mutations, typed result objects instead of thrown errors
