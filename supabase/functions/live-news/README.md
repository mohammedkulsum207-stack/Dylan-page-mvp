# Daily Drop live-news function

Public, read-only Kenya-English news feed for Daily Drop.

## Endpoint
`https://jqgkmtbflkdvyyoehhzx.supabase.co/functions/v1/live-news?category=Kenya`

Categories: All, World, Kenya, Business, Technology, Sports, Politics, Entertainment and Culture.

## Sources and reliability
- Google News RSS search is attempted first for the selected category.
- If unavailable, the function falls back to The Standard's official RSS feed for supported categories, then Nation Africa's Kenya RSS feed.
- Feed requests have a 10-second timeout. A successful source is cached in function memory for three minutes.
- Up to 20 headlines include publisher links, source, publication time and summary. Publisher images are currently optional and not fetched, to avoid slowing or destabilising the feed.
- CORS is enabled. The endpoint is public and read-only; no service-role key is exposed.

## Limitations
This is third-party RSS aggregation, not original Daily Drop reporting. Persistent reader bookmarks are stored separately in Supabase with owner-only row-level security. Persistent likes, comments, views, editorial newsroom workflow and full end-to-end/mobile tests remain outstanding. This PR does not publish to GitHub Pages.
