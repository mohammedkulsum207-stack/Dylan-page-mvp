import type { Story } from "../types";

const HOUR = 1000 * 60 * 60;

export function trendingScore(story: Story, now = Date.now()): number {
  const engagement = story.views + story.likes * 3 + story.comments * 5 + story.shares * 8;
  const ageHours = Math.max(1, (now - new Date(story.publishedAt).getTime()) / HOUR);
  const decay = Math.pow(ageHours + 2, 1.35);
  const boost = (story.isBreaking ? 1.5 : 1) * (story.isLive ? 2 : 1);
  return Math.round((engagement / decay) * boost);
}

export function trendingStories(stories: Story[], now = Date.now()): Story[] {
  return [...stories].sort(
    (a, b) => trendingScore(b, now) - trendingScore(a, now),
  );
}
