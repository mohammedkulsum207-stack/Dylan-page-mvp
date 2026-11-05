import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const queries: Record<string, string> = {
  All: "world news OR Kenya news OR business news when:1d",
  World: "world news when:1d",
  Kenya: "Kenya news when:1d",
  Business: "business and markets news when:1d",
  Technology: "technology news when:1d",
  Sports: "sports news when:1d",
  Politics: "politics news when:1d",
  Entertainment: "entertainment news when:1d",
  Culture: "arts culture news when:1d",
};

type Item = {
  title: string; link: string; source: string; publishedAt: string;
  summary: string; imageUrl: string | null; views: number; likes: number; comments: number;
};
const cache = new Map<string, { at: number; items: Item[] }>();

function decode(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function tag(xml: string, name: string) {
  const m = xml.match(new RegExp("<" + name + "\\b[^>]*>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return m ? decode(m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()) : "";
}
function rssItems(xml: string): Item[] {
  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map(m => {
    const rawDate = tag(m[1], "pubDate");
    const date = rawDate ? new Date(rawDate) : new Date();
    return {
      title: tag(m[1], "title"),
      link: tag(m[1], "link"),
      source: tag(m[1], "source") || "Google News",
      publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      summary: tag(m[1], "description").slice(0, 360),
      imageUrl: null, views: 0, likes: 0, comments: 0,
    };
  }).filter(x => x.title && /^https?:\/\//i.test(x.link)).slice(0, 20);
}
async function publisherImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DailyDropNews/1.0)", "Accept": "text/html" } });
    if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
    const html = (await response.text()).slice(0, 500000);
    const metas = html.match(/<meta\b[^>]*>/gi) || [];
    for (const meta of metas) {
      const property = meta.match(/(?:property|name)=["'](og:image|twitter:image)["']/i)?.[1]?.toLowerCase();
      const content = meta.match(/content=["']([^"']+)["']/i)?.[1];
      if (!property || !content) continue;
      try {
        const image = new URL(decode(content), response.url);
        if (image.protocol === "https:") return image.href;
      } catch { /* ignore invalid publisher metadata */ }
    }
    return null;
  } catch { return null; }
  finally { clearTimeout(timer); }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "All";
  const query = queries[category];
  if (!query) return new Response(JSON.stringify({ error: "Unsupported category" }), { status: 400, headers: cors });
  const cached = cache.get(category);
  if (cached && Date.now() - cached.at < 180000) {
    return new Response(JSON.stringify({ category, items: cached.items, fetchedAt: new Date(cached.at).toISOString(), refreshSeconds: 300, source: "Google News RSS" }), { headers: cors });
  }
  try {
    const feedUrl = new URL("https://news.google.com/rss/search");
    feedUrl.searchParams.set("q", query);
    feedUrl.searchParams.set("hl", "en-KE");
    feedUrl.searchParams.set("gl", "KE");
    feedUrl.searchParams.set("ceid", "KE:en");
    const response = await fetch(feedUrl, { headers: { "User-Agent": "DailyDropNews/1.0 (public RSS reader)" } });
    if (!response.ok) throw new Error("RSS provider returned " + response.status);
    const items = rssItems(await response.text());
    await Promise.all(items.slice(0, 8).map(async item => { item.imageUrl = await publisherImage(item.link); }));
    const at = Date.now();
    cache.set(category, { at, items });
    return new Response(JSON.stringify({ category, items, fetchedAt: new Date(at).toISOString(), refreshSeconds: 300, source: "Google News RSS" }), { headers: cors });
  } catch {
    return new Response(JSON.stringify({ error: "The live news feed is temporarily unavailable. Please retry shortly." }), { status: 503, headers: cors });
  }
});
