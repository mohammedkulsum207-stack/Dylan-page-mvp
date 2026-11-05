# Daily Drop live-news function

The `live-news` Supabase Edge Function provides a public, read-only news feed for the Daily Drop frontend.

## Endpoint

`https://jqgkmtbflkdvyyoehhzx.supabase.co/functions/v1/live-news?category=Kenya`

Supported categories: `All`, `World`, `Kenya`, `Business`, `Technology`, `Sports`, `Politics`, `Entertainment`, and `Culture`.

## Behaviour

- Reads Google News RSS results filtered to the Kenya English edition.
- Returns source title, publisher, original publisher URL, publication time and summary.
- Attempts to retrieve publisher Open Graph/Twitter images for the first eight results.
- Caches results in function memory for three minutes; frontend refresh target is five minutes.
- CORS is enabled for browser clients.
- Public endpoint is read-only and uses no service-role key.

## Important limitations

- This is a third-party RSS aggregation feed, not original Daily Drop reporting.
- Image metadata is best-effort; some publishers block automated requests or provide no image.
- Engagement counters currently return zero. The existing database tables still need a separately tested, authenticated integration for views, likes and comments.
- The React frontend has not yet been switched to this endpoint. Keep the existing production website unchanged until frontend integration and build tests pass.
