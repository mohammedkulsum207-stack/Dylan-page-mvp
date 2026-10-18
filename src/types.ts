export type NewsSource = {
  name: string;
  url: string;
  publishedAt: string;
};

export type Correction = {
  note: string;
  at: string;
};

export type Story = {
  id: string;
  headline: string;
  summary: string;
  body: string[];
  category: string;
  image: string;
  source: string;
  publishedAt: string;
  updatedAt?: string;
  sources: NewsSource[];
  isBreaking?: boolean;
  isLive?: boolean;
  liveUrl?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  corrections?: Correction[];
};
