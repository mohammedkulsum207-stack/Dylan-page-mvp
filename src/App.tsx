import { useEffect, useState } from "react";
import type { Story } from "./types";
import { DEMO_STORIES } from "./data/stories";
import { trendingStories } from "./lib/trending";
import StoryCard from "./components/StoryCard";
import Creator from "./pages/Creator";
import StoryPage from "./pages/Story";

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
  const [tab, setTab] = useState<Tab>("Latest");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creator, setCreator] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [data]);
  const stories = [...data.posts, ...DEMO_STORIES].map(s => ({ ...s, liveUrl: undefined, likes: s.likes + (data.liked.includes(s.id) ? 1 : 0) }));
  const active = stories.find(s => s.id === activeId);
  const toggle = (field: "saved" | "liked", id: string) => setData(d => ({ ...d, [field]: d[field].includes(id) ? d[field].filter(x => x !== id) : [...d[field], id] }));
  const actions = (s: Story) => <div className="tabs" style={{marginTop: 8}}><button className="tab" aria-pressed={data.liked.includes(s.id)} onClick={() => toggle("liked", s.id)}>{data.liked.includes(s.id) ? "♥ Liked" : "♡ Like"}</button><button className="tab" aria-pressed={data.saved.includes(s.id)} onClick={() => toggle("saved", s.id)}>{data.saved.includes(s.id) ? "Saved ✓" : "Save story"}</button></div>;
  const notice = <p className="meta" style={{lineHeight: 1.6}}>Independent Daily Drop concept for a potential Dylan Page partnership. Not affiliated with or endorsed by Dylan Page. Stories, sources, engagement counts and live badges are demonstrations, not real reporting or live broadcasts.</p>;
  if (creator) return <><div className="app">{notice}<p className="meta">Public demo editor, not a secure admin account. Posts are saved only in this browser.</p></div><Creator onBack={() => setCreator(false)} onPublish={s => { setData(d => ({...d, posts: [{...s, liveUrl: undefined}, ...d.posts]})); setCreator(false); setTab("Latest"); }} /></>;
  if (active) return <><div className="app" style={{paddingBottom: 0}}>{notice}{actions(active)}{storageError && <p role="alert">Browser storage unavailable; changes may not survive a refresh.</p>}</div><StoryPage story={active} onBack={() => setActiveId(null)} /></>;
  let visible = tab === "Trending" ? trendingStories(stories) : [...stories].sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  visible = visible.filter(s => (tab !== "Breaking" || s.isBreaking) && (tab !== "Live" || s.isLive) && (tab !== "Saved" || data.saved.includes(s.id)) && (category === "All" || s.category === category) && `${s.headline} ${s.summary} ${s.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="app"><header className="header"><div className="brand">The Daily <span>Drop</span></div><button className="tab" onClick={() => setCreator(true)}>Creator demo</button></header>{notice}
    {storageError && <p role="alert">Browser storage unavailable; changes may not survive a refresh.</p>}
    <label style={{display: "block", margin: "16px 0"}}>Search stories<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search headlines, topics…" style={{width: "100%", padding: 12, marginTop: 8, borderRadius: 12, background: "#14171d", color: "white", border: "1px solid #262a33"}} /></label>
    <nav className="tabs" aria-label="News sections">{(["Latest", "Breaking", "Live", "Trending", "Saved", "Videos"] as Tab[]).map(t => <button key={t} className={`tab ${tab === t ? "active" : ""}`} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</nav>
    <div className="tabs" aria-label="Categories">{["All", ...new Set(stories.map(s => s.category))].map(c => <button key={c} className={`tab ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {tab === "Videos" ? <section className="sources"><h2>Watch · Coming next</h2><p>No licensed news videos have been added. This section will host creator-approved clips; it does not play placeholder footage.</p></section> : visible.length ? visible.map(s => <section key={s.id}><StoryCard story={s} onOpen={() => setActiveId(s.id)} />{actions(s)}</section>) : <p className="empty">No matching stories. Try another search or save a story from Latest.</p>}
    {tab === "Live" && <p className="meta">Live coverage is a visual demo only. No broadcast is running.</p>}
    <section className="sources"><h3>Prototype status</h3><p className="meta">Likes, saves and creator posts stay in this browser only. Accounts, shared analytics, real video streaming and background breaking-news notifications require production services and are not connected.</p></section>
  </div>;
}
