import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  imageUrl: string | null;
};

const endpoint = 'https://jqgkmtbflkdvyyoehhzx.supabase.co/functions/v1/live-news';
const categories = ['All', 'Kenya', 'World', 'Business', 'Technology', 'Sports', 'Politics'];

export default function LiveNewsFeed() {
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(endpoint + '?category=' + encodeURIComponent(category));
        if (!response.ok) throw new Error('Feed request failed');
        const data = await response.json();
        if (active) { setItems(data.items || []); setError(''); }
      } catch {
        if (active) setError('Live headlines are temporarily unavailable. Please try again shortly.');
      } finally {
        if (active) setLoading(false);
      }
    };
    setLoading(true);
    void load();
    const timer = window.setInterval(() => void load(), 300000);
    return () => { active = false; window.clearInterval(timer); };
  }, [category]);

  return (
    <section className="live-wire" aria-labelledby="live-wire-heading">
      <div className="live-wire-top">
        <div><span className="live-wire-kicker">LIVE NEWSWIRE · PUBLISHER SOURCES</span>
          <h2 id="live-wire-heading">News happening <em>now.</em></h2>
          <p>Headlines from publishers, refreshed every five minutes. Open the original source to read each report.</p>
        </div>
        <span className="live-wire-status"><i /> LIVE FEED</span>
      </div>
      <div className="live-wire-categories" aria-label="News categories">
        {categories.map(item => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      {loading ? <p className="live-wire-message">Loading current headlines…</p> : error ? <p className="live-wire-message" role="status">{error}</p> : items.length === 0 ? <p className="live-wire-message">No headlines returned for this section. Try another category.</p> : (
        <div className="live-wire-grid">
          {items.map(item => <article className="live-wire-card" key={item.link}>
            {item.imageUrl && <a href={item.link} target="_blank" rel="noopener noreferrer"><img src={item.imageUrl} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} /></a>}
            <div className="live-wire-copy"><div className="live-wire-meta"><b>{item.source}</b><time dateTime={item.publishedAt}>{new Date(item.publishedAt).toLocaleString()}</time></div>
              <h3><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title} ↗</a></h3>
              {item.summary && <p>{item.summary.replace(/<[^>]*>/g, '').slice(0, 210)}</p>}
              <a className="live-wire-read" href={item.link} target="_blank" rel="noopener noreferrer">Read at publisher ↗</a>
            </div>
          </article>)}
        </div>
      )}
      <p className="live-wire-disclaimer">Feed source: Google News RSS. Headlines and summaries are provided by the linked publishers; Daily Drop does not claim ownership of their reporting. Publisher images are shown only when available.</p>
    </section>
  );
}
