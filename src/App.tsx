import { useState } from "react";
import type { Story } from "./types";
import { DEMO_STORIES } from "./data/stories";
import { trendingStories } from "./lib/trending";
import StoryCard from "./components/StoryCard";
import Creator from "./pages/Creator";
import StoryPage from "./pages/Story";

type Tab = "Latest" | "Breaking" | "Live" | "Trending";

export default function App() {
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [tab, setTab] = useState<Tab>("Latest");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const visible =
    tab === "Breaking"
      ? stories.filter((s) => s.isBreaking)
      : tab === "Live"
        ? stories.filter((s) => s.isLive)
        : tab === "Trending"
          ? trendingStories(stories)
          : stories;

  const active = stories.find((s) => s.id === activeId);

  if (active) return <StoryPage story={active} onBack={() => setActiveId(null)} />;

  if (showCreator)
    return (
      <Creator
        onBack={() => setShowCreator(false)}
        onPublish={(story) => {
          setStories((current) => [story, ...current]);
          setShowCreator(false);
          setTab("Latest");
        }}
      />
    );

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          News <span>Daddy</span>
        </div>
        <button className="tab" onClick={() => setShowCreator(true)}>
          Creator
        </button>
      </header>

      <div className="tabs">
        {(["Latest", "Breaking", "Live", "Trending"] as Tab[]).map((item) => (
          <button
            key={item}
            className={`tab ${tab === item ? "active" : ""}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">No stories in this tab yet.</div>
      ) : (
        visible.map((story) => (
          <StoryCard key={story.id} story={story} onOpen={() => setActiveId(story.id)} />
        ))
      )}
    </div>
  );
}
