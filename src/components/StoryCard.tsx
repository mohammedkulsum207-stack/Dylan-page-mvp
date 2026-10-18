import type { Story } from "../types";

function format(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export default function StoryCard({ story, onOpen }: { story: Story; onOpen: () => void }) {
  return (
    <button className="card" onClick={onOpen}>
      <img className="card-image" src={story.image} alt="" />
      <div className="card-body">
        <div>
          {story.isBreaking && <span className="badge badge-breaking">BREAKING</span>}
          {story.isLive && <span className="badge badge-live">LIVE</span>}
        </div>
        <h2>{story.headline}</h2>
        <p className="meta">
          {story.category} · {story.source} ·{" "}
          {new Date(story.publishedAt).toLocaleTimeString()}
        </p>
        <div className="metrics">
          <span>{format(story.views)} views</span>
          <span>{format(story.likes)} likes</span>
          <span>{format(story.comments)} comments</span>
          <span>{format(story.shares)} shares</span>
        </div>
      </div>
    </button>
  );
}
