import type { Story } from "../types";

const ago = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const DEMO_STORIES: Story[] = [
  {
    id: "breaking-1",
    headline: "Sample: Major city announces emergency overnight transport plan",
    summary: "Illustrative breaking-news demo showing how The Daily Drop would publish a fast update with sources.",
    body: [
      "This is sample content for the The Daily Drop MVP. It does not describe a real event.",
      "In this scenario, a city launches overnight transport for late-shift workers after a pilot request from hospitals and logistics companies.",
      "The story page shows the announcement source, publication time, engagement, and any later correction.",
    ],
    category: "World",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    source: "The Daily Drop Demo Desk",
    publishedAt: ago(12),
    updatedAt: ago(4),
    sources: [
      { name: "Demo City Transport Authority", url: "https://example.com/transport", publishedAt: ago(15) },
      { name: "Demo Regional News", url: "https://example.com/regional-report", publishedAt: ago(18) },
    ],
    isBreaking: true,
    views: 184320,
    likes: 12480,
    comments: 2140,
    shares: 3860,
  },
  {
    id: "live-1",
    headline: "Sample: Festival lineup drops and ticket demand goes live",
    summary: "A live-coverage example with a stream link, viewer engagement, and real-time updates.",
    body: [
      "This is sample content for the The Daily Drop MVP. No real festival or artist is referenced.",
      "In this scenario, an unexpected lineup announcement creates a major ticket queue.",
      "A live stream would appear here during a major developing story.",
    ],
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    source: "The Daily Drop Demo Desk",
    publishedAt: ago(35),
    sources: [
      { name: "Demo Festival Organizer", url: "https://example.com/festival", publishedAt: ago(40) },
    ],
    isLive: true,
    liveUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: 241870,
    likes: 21840,
    comments: 5210,
    shares: 8730,
  },
  {
    id: "tech-1",
    headline: "Sample: New chip design targets longer phone battery life",
    summary: "A tech explainer demonstrating transparent sourcing and a visible correction.",
    body: [
      "This is sample content for the The Daily Drop MVP. It does not describe a real product or company.",
      "In this hypothetical, a chipmaker says a new low-power design could extend battery life by about 20%.",
      "The correction below demonstrates how The Daily Drop would handle an updated claim transparently.",
    ],
    category: "Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    source: "The Daily Drop Demo Desk",
    publishedAt: ago(90),
    updatedAt: ago(50),
    sources: [
      { name: "Demo Chipmaker Release", url: "https://example.com/chip", publishedAt: ago(95) },
    ],
    views: 96410,
    likes: 7320,
    comments: 1180,
    shares: 1640,
    corrections: [
      { note: "An earlier version said battery life could improve by 25%. The stated estimate is approximately 20%.", at: ago(50) },
    ],
  },
];
