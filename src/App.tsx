import { useEffect, useState } from "react";
import type { Story } from "./types";
import { DEMO_STORIES } from "./data/stories";
import { trendingStories } from "./lib/trending";
import StoryCard from "./components/StoryCard";
import Creator from "./pages/Creator";
import StoryPage from "./pages/Story";
import Login from "./pages/Login";

type Tab = "Latest" | "Breaking" | "Live" | "Trending" | "Saved" | "Videos";
type Stored = { posts: Story[]; saved: string[]; liked: string[] };
const KEY = "daily-drop-demo-v1";
function read(): Stored {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { posts: Array.isArray(value.posts) ? value.posts : [], saved: Array.isArray(value.saved) ? value.saved : [], liked: Array.isArray(value.liked) ? value.liked : [] };
  } catch { return { posts: [], saved: [], liked: [] }; }
}
export default function App() {
  const [data, setData] = useState<Stored>(read);
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState<Tab>("Latest");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creator, setCreator] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try { return localStorage.getItem("daily-drop-theme") === "light" ? "light" : "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [data]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("daily-drop-theme", theme); } catch { /* Theme still works for this session. */ }
  }, [theme]);
  const stories = [...data.posts, ...DEMO_STORIES].map(s => ({ ...s, liveUrl: undefined, likes: s.likes + (data.liked.includes(s.id) ? 1 : 0) }));
  const active = stories.find(s => s.id === activeId);
  const toggle = (field: "saved" | "liked", id: string) => setData(d => ({ ...d, [field]: d[field].includes(id) ? d[field].filter(x => x !== id) : [...d[field], id] }));
  const actions = (s: Story) => <div className="story-actions"><button className="quiet-button" aria-pressed={data.liked.includes(s.id)} onClick={() => toggle("liked", s.id)}>{data.liked.includes(s.id) ? "♥ Liked" : "♡ Like"}</button><button className="quiet-button" aria-pressed={data.saved.includes(s.id)} onClick={() => toggle("saved", s.id)}>{data.saved.includes(s.id) ? "✓ Saved" : "＋ Save story"}</button></div>;
  const notice = null;
  if (!entered) return <Login onEnter={() => setEntered(true)} />;
  if (creator) return <><div className="app">{notice}<p className="meta">Demo editor only. This is not a secure admin account; posts are saved in this browser.</p></div><Creator onBack={() => setCreator(false)} onPublish={s => { setData(d => ({...d, posts: [{...s, liveUrl: undefined}, ...d.posts]})); setCreator(false); setTab("Latest"); }} /></>;
  if (active) return <><div className="app compact-top">{notice}{actions(active)}{storageError && <p role="alert">Browser storage is unavailable; changes may not survive a refresh.</p>}</div><StoryPage story={active} onBack={() => setActiveId(null)} /></>;
  let visible = tab === "Trending" ? trendingStories(stories) : [...stories].sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  visible = visible.filter(s => (tab !== "Breaking" || s.isBreaking) && (tab !== "Live" || s.isLive) && (tab !== "Saved" || data.saved.includes(s.id)) && (category === "All" || s.category === category) && `${s.headline} ${s.summary} ${s.category}`.toLowerCase().includes(query.toLowerCase()));
  const showLead = tab === "Latest" && !query.trim() && category === "All" && visible.length > 0;
  const lead = showLead ? visible[0] : undefined;
  const list = lead ? visible.slice(1) : visible;
  return <div className="app">
    <header className="masthead">
      <div className="masthead-top"><span className="edition">INDEPENDENT NEWS CONCEPT</span><span className="edition">NEWS · CONTEXT · CLARITY</span></div>
      <div className="header">
        <button className="wordmark" aria-label="The Daily Drop home" onClick={() => { setTab("Latest"); setCategory("All"); setQuery(""); setActiveId(null); }}><span className="wordmark-main">THE DAILY</span><span className="wordmark-drop">DROP<span className="wordmark-period">.</span></span></button>
        <div className="header-actions"><button className="icon-button" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "☼" : "☾"}</button><button className="outline-button" onClick={() => setCreator(true)}>Creator desk <span aria-hidden="true">↗</span></button></div>
      </div>
      <div className="masthead-rule"><span>YOUR WORLD, WELL INFORMED.</span><span>EDITION 001</span></div>
    </header>
    {notice}
    {storageError && <p role="alert" className="storage-warning">Browser storage is unavailable; changes may not survive a refresh.</p>}
    <section className="briefing-bar"><span className="briefing-dot" /> THE NEWS BRIEFING <span className="briefing-copy">The important stories, without the noise.</span></section>
    <label className="search-label">Search the newsroom<input className="search-input" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search headlines, topics and categories…" /></label>
    <nav className="tabs" aria-label="News sections">{(["Latest", "Breaking", "Live", "Trending", "Saved", "Videos"] as Tab[]).map(t => <button key={t} className={`tab ${tab === t ? "active" : ""}`} aria-pressed={tab === t} onClick={() => setTab(t)}>{t === "Breaking" && <span className="tab-mark">•</span>}{t}</button>)}</nav>
    <div className="category-row" aria-label="Categories">{["All", ...new Set(stories.map(s => s.category))].map(c => <button key={c} className={`category-chip ${category === c ? "active" : ""}`} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {tab === "Videos" ? <section className="empty-panel"><span className="section-eyebrow">THE WATCH DESK</span><h2>Video, with context.</h2><p>No licensed news videos have been added yet. This space is reserved for creator-approved clips and explainers—not placeholder footage.</p></section> :
      <>{lead && <section className="lead-story"><div className="section-heading"><span className="section-eyebrow">THE LEAD STORY</span><span className="meta">EDITOR'S PICK</span></div><button className="lead-card" onClick={() => setActiveId(lead.id)}><img src={lead.image} alt="" /><div className="lead-content"><div className="lead-tags">{lead.isBreaking && <span className="badge badge-breaking">BREAKING</span>}<span className="lead-category">{lead.category}</span></div><h1>{lead.headline.replace(/^Sample:\s*/i, "")}</h1><p>{lead.summary}</p><div className="lead-byline"><span>{lead.source}</span><span>{new Date(lead.publishedAt).toLocaleDateString(undefined, {month:"short",day:"numeric"})}</span><span>Read story ↗</span></div></div></button>{actions(lead)}</section>}
      {list.length > 0 && <div className="section-heading latest-heading"><span className="section-eyebrow">{tab === "Latest" ? "LATEST REPORTS" : tab.toUpperCase() + " COVERAGE"}</span><span className="meta">{list.length} {list.length === 1 ? "STORY" : "STORIES"}</span></div>}
      {list.length ? list.map(s => <section key={s.id} className="story-list-item"><StoryCard story={s} onOpen={() => setActiveId(s.id)} />{actions(s)}</section>) : !lead && <p className="empty">No matching stories. Try another search or save a story from Latest.</p>}
      </>}
    {tab === "Live" && <p className="meta">Live coverage is a visual demo only. No broadcast is running.</p>}
    <footer className="site-footer"><div className="footer-wordmark">THE DAILY DROP<span>.</span></div><p>Clear reporting. Useful context. A better-informed world.</p><div className="footer-rule" /><p className="meta">Independent prototype · © The Daily Drop concept</p><p className="meta">Likes, saves and creator posts are stored in this browser only. Accounts, shared analytics, streaming and push notifications require production services.</p></footer>
  </div>;
}
