# News Daddy MVP

A mobile-first news MVP built for a potential News Daddy partnership.

It demonstrates a creator-owned news platform with breaking alerts, live coverage, verified sources, trending stories, and a creator dashboard.

## Features

- Latest, Breaking, Live, and Trending feeds
- Story pages with source links and publication times
- Breaking and Live badges
- View, like, comment, and share metrics
- Visible corrections and updates
- Creator dashboard for demo publishing
- Mobile-first responsive interface
- Automatic GitHub Pages deployment

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Important note

All stories are illustrative demo content, not real reporting. Production accounts, push notifications, real publishing, live streaming, analytics, and moderation still need to be connected.


## Connected reader accounts and newsroom publishing

The main navigation now includes an **Account** area connected to the project's Supabase backend.

- Readers can create an account, sign in, and sign out.
- Signed-in readers can view stories published to the shared database.
- Publishing is restricted to accounts assigned an editor role in the backend.
- Editors can publish sourced stories to the shared reader feed.
- The existing demo feed, saved stories, likes, topic preferences, and demo creator tools remain available separately in browser storage.

### Important production requirements

The Account area uses the project's existing Supabase project and its publishable client key. Before public launch, verify Supabase Row Level Security policies, editor-role assignment permissions, email confirmation, password recovery, rate limits, and production data-retention rules. A browser-side role check is not a substitute for database-enforced authorization. Do not put service-role keys or other secrets in frontend code.

The app is still a prototype. This update adds the connected account and shared publishing entry point; it does not yet implement the complete membership payments, advertiser portal, staff HR, native Android app, or live broadcast systems described in the product roadmap.
