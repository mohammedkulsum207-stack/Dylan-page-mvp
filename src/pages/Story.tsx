import type { Story } from "../types";

function format(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export default function StoryPage({ story, onBack }: { story: Story; onBack: () => void }) {
  return (
    <div className="app">
      <button className="back" onClick={onBack}>
        ← Back
      </button>

      <img className="story-hero" src={story.image} alt="" />

      <div style={{ marginTop: 14 }}>
        {story.isBreaking && <span className="badge badge-breaking">BREAKING</span>}
        {story.isLive && <span className="badge badge-live">LIVE</span>}

        <h1 style={{ fontSize: 26, lineHeight: 1.2, margin: "12px 0 8px" }}>
          {story.headline}
        </h1>
        <p className="meta">
          {story.category} · {story.source} ·{" "}
          Published {new Date(story.publishedAt).toLocaleString()}
          {story.updatedAt ? ` · Updated ${new Date(story.updatedAt).toLocaleString()}` : ""}
        </p>

        <div className="metrics">
          <span>{format(story.views)} views</span>
          <span>{format(story.likes)} likes</span>
          <span>{format(story.comments)} comments</span>
          <span>{format(story.shares)} shares</span>
        </div>

        {story.isLive && story.liveUrl && (
          <a className="source" href={story.liveUrl} target="_blank" rel="noreferrer">
            ▶ Watch live coverage
            <small>Opens the live stream in a new tab</small>
          </a>
        )}

        <div style={{ marginTop: 18, lineHeight: 1.65 }}>
          {story.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <section className="sources">
          <h3>Sources & verification</h3>
          {story.sources.map((source) => (
            <a
              key={source.url}
              className="source"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.name}
              <small>Published {new Date(source.publishedAt).toLocaleString()}</small>
            </a>
          ))}
        </section>

        {story.corrections?.length ? (
          <section className="corrections">
            <h3>Corrections & updates</h3>
            {story.corrections.map((correction) => (
              <p key={correction.at} className="meta">
                {correction.note} — {new Date(correction.at).toLocaleString()}
              </p>
            ))}
          </section>
        ) : null}

        <p className="meta" style={{ marginTop: 18 }}>
          Demo content for a product concept. Not real reporting.
        </p>
      </div>
    </div>
  );
}
