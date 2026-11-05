# Daily Drop live-news function

The `live-news` Supabase Edge Function provides a public, read-only Kenya-English news feed for the Daily Drop frontend.

## Endpoint

`https://jqgkmtbflkdvyyoehhzx.supabase.co/functions/v1/live-news?category=Kenya`

Supported categories: `All`, `World`, `Kenya`, `Business`, `Technology`, `Sports`, `Politics`, `Entertainment`, and `Culture`.

## Behaviour

- Fetches current Google News RSS results for the Kenya English edition.
- Returns up to 20 headline items with publisher name, original publisher URL, publication time and a short summary.
- The response is cached in function memory for three minutes; the frontend refreshes every five minutes.
- CORS is enabled for browser clients.
- Public endpoint is read-only and uses no service-role key.
- The frontend supports publisher images if a trusted image URL is supplied, but this version does not yet resolve publisher image metadata. Images are therefore optional/absent in the current feed.

## Verified checks

The GitHub Actions preview workflow completed successfully on 5 November 2026:
- TypeScript/Vite production build passed.
- Live endpoint returned HTTP 200.
- Kenya category returned 20 items.

## Important limitations

- This is third-party RSS aggregation, not original Daily Drop reporting.
- Engagement counters are not yet persisted; views, likes and comments require a separately tested authenticated integration.
- Reader authentication, bookmarks and newsroom integration remain outstanding.
- This pull request does not publish to GitHub Pages. The production website remains unchanged until the remaining work is tested.
