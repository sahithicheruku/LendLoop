# LendLoop

LendLoop is a community lending platform where people can list items, request things to borrow, approve lending requests, and manage returns.

## Overview

LendLoop replaces one-off borrowing conversations with a simple lending workflow. An authenticated user lists an item, another user requests it, the owner approves or declines the request, and the approved borrower returns the item when finished.

## Features

- Google sign-in with NextAuth
- User-owned item listings
- Available-item browsing with title search and category filtering
- Optional image URLs with local placeholders
- Borrow requests with pending, approved, declined, cancelled, and returned states
- Owner approval, decline, and deletion controls
- Borrower return flow
- Server-side authorization for all mutations
- User-specific dashboard sections for owned, incoming, requested, and borrowed items

## Tech Stack

- Next.js 16.1.1 App Router
- React 19.2.3
- TypeScript
- Tailwind CSS 4
- NextAuth 4.24.13 with Google OAuth
- Prisma 5.22.0
- PostgreSQL
- Vercel-compatible deployment

## Architecture

The application uses Next.js App Router server components for authenticated data reads and client components for interactive item actions. Prisma provides the PostgreSQL data layer. NextAuth manages Google OAuth and JWT sessions, with typed session user IDs.

Ownership and authorization are enforced on the server. `Item.ownerId` identifies the user who listed an item. `BorrowRequest` connects an item to its requester and stores the request lifecycle independently from the item’s aggregate status.

## Lending Workflow

```text
Available → Requested → Approved / Borrowed → Returned → Available
```

Requests may also end as `Declined` or `Cancelled`.

## Local Development

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` from `.env.example` and configure PostgreSQL and Google OAuth values.
4. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Run the development migration when the database is configured and the schema/data plan is approved:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL` — pooled PostgreSQL connection string.
- `DIRECT_URL` — direct PostgreSQL connection string used by Prisma migrations.
- `GOOGLE_CLIENT_ID` — Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret.
- `NEXTAUTH_SECRET` — secret used to sign NextAuth tokens.
- `NEXTAUTH_URL` — application URL; use `http://localhost:3000` locally.

Use placeholders from `.env.example`; never commit real credentials.

## Security and Authorization

- Item ownership is assigned from the authenticated session, never from client input.
- Users cannot request their own items.
- Only owners can approve, decline, or delete items.
- Only request creators can cancel pending requests.
- Authenticated mutations are protected by server-side session checks.
- Dashboard queries are scoped to the authenticated user ID.

## Screenshots / Demo

The live demo and screenshots can be added when the deployment environment is configured. Suggested screenshot locations:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/browse-items.png`
- `docs/screenshots/request-flow.png`

## Future Improvements

- Image upload and storage
- Notifications for request state changes
- Expanded lending history
- Optional borrower-owner messaging
