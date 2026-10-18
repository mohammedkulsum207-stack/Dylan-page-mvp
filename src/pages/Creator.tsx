import { useState } from "react";
import type { Story } from "../types";

export default function Creator({
  onBack,
  onPublish,
}: {
  onBack: () => void;
  onPublish: (story: Story) => void;
}) {
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const publish = () => {
    if (!headline.trim() || !summary.trim()) return;

    onPublish({
      id: `post-${Date.now()}`,
      headline,
      summary,
      body: [summary, "This post was published from the News Daddy creator dashboard demo."],
      category: "World",
      image:
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
      source: "News Daddy Creator",
      publishedAt: new Date().toISOString(),
      sources: sourceName && sourceUrl
        ? [{ name: sourceName, url: sourceUrl, publishedAt: new Date().toISOString() }]
        : [],
      isBreaking,
      isLive,
      views: 1,
      likes: 0,
      comments: 0,
      shares: 0,
    });
  };

  return (
    <div className="app dashboard">
      <button className="back" onClick={onBack}>
        ← Back
      </button>
      <h1>Creator dashboard</h1>
      <p className="meta">Publish a demo news update.</p>

      <input
        placeholder="Headline"
        value={headline}
        onChange={(event) => setHeadline(event.target.value)}
      />
      <textarea
        placeholder="What happened? Add the key update."
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <input
        placeholder="Source name"
        value={sourceName}
        onChange={(event) => setSourceName(event.target.value)}
      />
      <input
        placeholder="Source URL"
        value={sourceUrl}
        onChange={(event) => setSourceUrl(event.target.value)}
      />

      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={isBreaking}
          onChange={(event) => setIsBreaking(event.target.checked)}
        />{" "}
        Mark as Breaking
      </label>

      <label style={{ display: "block", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={isLive}
          onChange={(event) => setIsLive(event.target.checked)}
        />{" "}
        Mark as Live
      </label>

      <button className="primary" onClick={publish}>
        Publish update
      </button>
    </div>
  );
}
