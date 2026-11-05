# Daily Drop full migration

This branch is reserved for transferring the complete Daily Drop AppDeploy application into this GitHub repository while keeping main unchanged until the migrated build is verified.

## Source inventory
The AppDeploy source project contains:
- React 19 + Vite front end and responsive editorial design.
- Latest edition with category filters, search, story pages, share and audio narration.
- Live Newswire with Google News RSS category feeds, publisher-image metadata, five-minute refresh, views, likes and comments.
- Reader account, saved stories, followed topics and reading history.
- Private Newsroom drafts.
- Commercial Desk for membership and advertising enquiries.
- Trust Centre and correction concerns.
- Backend API routes for feed, engagement, reader bookmarks, editorial drafts, commercial enquiries and correction requests.

## Target architecture
- GitHub repository: source code, version history and CI deployment.
- GitHub Pages: static React/Vite frontend.
- Supabase Auth: reader/editor identity and sessions.
- Supabase Postgres: drafts, bookmarks, engagement, comments and enquiries, protected with row-level security.
- Supabase Edge Functions: live RSS aggregation, publisher image metadata lookup, and privileged server-side operations.
- Supabase Storage: optional first-party editorial image storage.

## Migration rules
1. Preserve the current main branch and public site until the replacement passes build and functional checks.
2. Port the complete source UI and all route behavior; do not replace it with a reduced demo.
3. Replace AppDeploy-only imports with Supabase-compatible client and Edge Function calls.
4. Add SQL migrations and row-level security policies before enabling user data features.
5. Keep RSS attribution and publisher links visible. Use a neutral image fallback when a publisher supplies no usable image.
6. Configure GitHub Pages project base path and deployment workflow for this repository.
7. Keep all secrets out of Git. Only the Supabase project URL and public anon key may be exposed in the browser; service-role keys stay server-side.
8. Verify npm build, deployed asset paths, authentication, feed refresh, image fallback, comments, likes, saved stories and Newsroom access before merging.

## Known launch limitations
The source currently uses illustrative sample stories and a live third-party RSS aggregator. A live feed is not original Daily Drop reporting. Video, paid membership and advertising transactions are not active payment products.
