import { useEffect, useState } from 'react';

const URL = 'https://jqgkmtbflkdvyyoehhzx.supabase.co';
const KEY = 'sb_publishable_5BZkLUow6QQg5fR9ZbOVZQ_qfB4rbgK';
type User = { id: string; email?: string };
type Session = { access_token: string; refresh_token: string; user: User };
type Story = { id: string; headline: string; summary: string; body: unknown; category: string; image: string | null; published_at: string; sources: {name:string;url:string}[] };
type Comment = { id: string; story_id: string; content: string; status: string; created_at: string };

export default function BackendPanel() {
 const [session,setSession] = useState<Session|null>(null);
 const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
 const [message,setMessage] = useState(''); const [busy,setBusy] = useState(false);
 const [posts,setPosts] = useState<Story[]>([]);
 const [saved,setSaved] = useState<string[]>([]); const [liked,setLiked] = useState<string[]>([]);
 const [comments,setComments] = useState<Record<string,Comment[]>>({});
 const [drafts,setDrafts] = useState<Record<string,string>>({});
 const [editor,setEditor] = useState(false);
 const [headline,setHeadline] = useState(''); const [summary,setSummary] = useState(''); const [source,setSource] = useState(''); const [sourceUrl,setSourceUrl] = useState('');

 async function request(path:string, method='GET', body?:unknown, token?:string) {
  const response = await fetch(URL+path,{method,headers:{apikey:KEY,...(token?{Authorization:`Bearer ${token}`}:{}),'Content-Type':'application/json',...(method==='POST'?{Prefer:'return=representation'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  const raw = await response.text(); let result; try { result=raw?JSON.parse(raw):null; } catch { throw new Error('Unexpected response from the database.'); }
  if(!response.ok) throw new Error(result?.msg||result?.message||result?.error_description||result?.details||'Request failed. Please try again.');
  return result;
 }
 async function loadStories(token?:string) {
  const rows=await request('/rest/v1/stories?status=eq.published&select=id,headline,summary,body,category,image,published_at,sources&order=published_at.desc','GET',undefined,token);
  setPosts(rows||[]);
 }
 async function loadReaderData(s:Session) {
  const [saves,likes]=await Promise.all([
   request(`/rest/v1/saves?user_id=eq.${s.user.id}&select=story_id`,'GET',undefined,s.access_token),
   request(`/rest/v1/likes?user_id=eq.${s.user.id}&select=story_id`,'GET',undefined,s.access_token)
  ]);
  setSaved((saves||[]).map((x:{story_id:string})=>x.story_id));
  setLiked((likes||[]).map((x:{story_id:string})=>x.story_id));
  const rows=await request('/rest/v1/comments?select=id,story_id,content,status,created_at&order=created_at.desc','GET',undefined,s.access_token);
  const grouped:Record<string,Comment[]>={}; (rows||[]).forEach((c:Comment)=>{(grouped[c.story_id]??=[]).push(c);}); setComments(grouped);
 }
 useEffect(()=>{const raw=localStorage.getItem('daily-drop-session'); if(raw){try{const s=JSON.parse(raw) as Session;if(s.access_token&&s.refresh_token&&s.user?.id){setSession(s);loadStories(s.access_token).then(()=>loadReaderData(s)).catch(()=>{localStorage.removeItem('daily-drop-session');setSession(null);setMessage('Your saved session expired. Please sign in again.');});return;}}catch{localStorage.removeItem('daily-drop-session');}} loadStories().catch(e=>setMessage(e.message));},[]);
 async function authenticate(signup:boolean) {
  setBusy(true);setMessage('');
  try {
   const result=await request(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password','POST',{email,password});
   setPassword('');
   if(result.access_token&&result.user){
    const s:Session={access_token:result.access_token,refresh_token:result.refresh_token,user:result.user};
    setSession(s);localStorage.setItem('daily-drop-session',JSON.stringify(s));
    await Promise.all([loadStories(s.access_token),loadReaderData(s)]);
    const roles=await request(`/rest/v1/editors?user_id=eq.${s.user.id}&select=user_id`,'GET',undefined,s.access_token);setEditor(roles.length>0);
    setMessage('You are signed in. Your saved stories and reader activity are now linked to your account.');
   } else setMessage('Check your email for the confirmation link, then return here to sign in.');
  } catch(e){setMessage(e instanceof Error?e.message:'Authentication failed.');} finally{setBusy(false);}
 }
 async function refreshSession() {
  const raw=localStorage.getItem('daily-drop-session');
  const current=(raw?JSON.parse(raw):session) as Session|null;
  if(!current?.refresh_token) return session;
  const next=await request('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:current.refresh_token});
  const s:Session={access_token:next.access_token,refresh_token:next.refresh_token,user:next.user};
  setSession(s);localStorage.setItem('daily-drop-session',JSON.stringify(s));return s;
 }
 async function withSession(action:(s:Session)=>Promise<void>) {
  const raw=localStorage.getItem('daily-drop-session');
  const current=(raw?JSON.parse(raw):session) as Session|null;
  if(!current){setMessage('Sign in to use reader features.');return;}
  setBusy(true);setMessage('');
  try{let s=current;try{await action(s);}catch(first){if(!s.refresh_token)throw first;s=await refreshSession()||s;await action(s);} }
  catch(e){setMessage(e instanceof Error?e.message:'The action could not be completed.');}
  finally{setBusy(false);}
 }
 async function toggle(table:'saves'|'likes',storyId:string) {
  await withSession(async s=>{
   const active=(table==='saves'?saved:liked).includes(storyId);
   if(active) await request(`/rest/v1/${table}?user_id=eq.${s.user.id}&story_id=eq.${storyId}`,'DELETE',undefined,s.access_token);
   else await request(`/rest/v1/${table}`,'POST',{user_id:s.user.id,story_id:storyId},s.access_token);
   if(table==='saves')setSaved(v=>active?v.filter(x=>x!==storyId):[...v,storyId]);
   else setLiked(v=>active?v.filter(x=>x!==storyId):[...v,storyId]);
  });
 }
 async function addComment(storyId:string) {
  const content=drafts[storyId]?.trim();if(!content)return;
  await withSession(async s=>{
   const rows=await request('/rest/v1/comments','POST',{story_id:storyId,user_id:s.user.id,content,status:'pending'},s.access_token);
   const added=(rows||[])[0];if(added)setComments(v=>({...v,[storyId]:[added,...(v[storyId]||[])]}));
   setDrafts(v=>({...v,[storyId]:''}));setMessage('Comment submitted. It will appear publicly after editorial approval.');
  });
 }
 async function publishStory() {
  if(!session)return;
  setBusy(true);setMessage('');
  try {
   const parsed=new URL(sourceUrl);if(!['https:','http:'].includes(parsed.protocol))throw new Error('Use a valid HTTP or HTTPS source URL.');
   if(!headline.trim()||!summary.trim()||!source.trim())throw new Error('Complete the headline, story and source fields.');
   await request('/rest/v1/stories','POST',{headline:headline.trim(),summary:summary.trim(),body:[summary.trim()],category:'World',author_id:session.user.id,sources:[{name:source.trim(),url:parsed.href}],status:'published',published_at:new Date().toISOString()},session.access_token);
   await loadStories(session.access_token);setHeadline('');setSummary('');setSource('');setSourceUrl('');setMessage('Story published to the shared Daily Drop database.');
  }catch(e){setMessage(e instanceof Error?e.message:'Publishing failed.');}finally{setBusy(false);}
 }
 async function signOut() {
  if(session)try{await request('/auth/v1/logout','POST',undefined,session.access_token);}catch{}
  localStorage.removeItem('daily-drop-session');setSession(null);setEditor(false);setSaved([]);setLiked([]);setComments({});setMessage('Signed out.');
 }
 return <section className="app dashboard">
  <h1>The Daily Drop · Reader account</h1>
  <p className="meta">Create an account to keep saved stories, likes and comments in the shared database across devices.</p>
  {!session?<form onSubmit={e=>{e.preventDefault();authenticate(false);}}>
   <label>Email<input type="email" required value={email} autoComplete="email" onChange={e=>setEmail(e.target.value)}/></label>
   <label>Password<input type="password" required minLength={8} value={password} autoComplete="current-password" onChange={e=>setPassword(e.target.value)}/></label>
   <button className="tab" disabled={busy} type="submit">Sign in</button>
   <button className="tab" disabled={busy||!email||password.length<8} type="button" onClick={()=>authenticate(true)}>Create account</button>
  </form>:<div className="panel"><p>Signed in as <strong>{session.user.email||'reader'}</strong></p><p className="meta">Saved stories: {saved.length} · Liked stories: {liked.length}</p><button className="tab" disabled={busy} onClick={signOut}>Sign out</button>{editor&&<p className="meta">Editorial access is enabled for this account.</p>}</div>}
  <p role="status" aria-live="polite">{message}</p>
  {editor&&<section className="panel"><h2>Newsroom · Publish a sourced story</h2><form onSubmit={e=>{e.preventDefault();publishStory();}}><label>Headline<input required maxLength={180} value={headline} onChange={e=>setHeadline(e.target.value)}/></label><label>Story summary<textarea required value={summary} onChange={e=>setSummary(e.target.value)}/></label><label>Source name<input required value={source} onChange={e=>setSource(e.target.value)}/></label><label>Source URL<input required type="url" value={sourceUrl} onChange={e=>setSourceUrl(e.target.value)}/></label><button className="primary" disabled={busy}>Publish story</button></form></section>}
  <h2>Published stories · Shared database</h2>
  <button className="tab" disabled={busy} onClick={()=>loadStories(session?.access_token).catch(e=>setMessage(e.message))}>Refresh stories</button>
  {!posts.length&&<p>No published database stories are available yet. The demo homepage remains separate.</p>}
  {posts.map(p=><article className="sources panel" key={p.id}>
   <h2>{p.headline}</h2><p className="meta">{p.category} · {p.published_at?new Date(p.published_at).toLocaleString():''}</p>
   <p style={{whiteSpace:'pre-wrap'}}>{p.summary}</p>
   <div className="actions">
    <button className="chip" disabled={busy||!session} onClick={()=>toggle('likes',p.id)}>{liked.includes(p.id)?'♥ Liked':'♡ Like'}</button>
    <button className="chip" disabled={busy||!session} onClick={()=>toggle('saves',p.id)}>{saved.includes(p.id)?'Saved ✓':'Save story'}</button>
   </div>
   {Array.isArray(p.sources)&&p.sources.map((s,i)=><a key={i} className="source" href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>)}
   <h3>Comments</h3>
   {(comments[p.id]||[]).map(c=><p className="row" key={c.id}>{c.content}<span className="meta"> · {c.status==='approved'?'Published':'Awaiting moderation'}</span></p>)}
   {session&&<form onSubmit={e=>{e.preventDefault();addComment(p.id);}}>
    <label>Join the discussion<textarea maxLength={2000} required value={drafts[p.id]||''} onChange={e=>setDrafts(v=>({...v,[p.id]:e.target.value}))}/></label>
    <button className="primary" disabled={busy||!(drafts[p.id]||'').trim()}>Submit comment</button>
   </form>}
  </article>)}
  {!session&&<p className="meta">Sign in to save stories, like articles or submit comments. Comments are moderated before public display.</p>}
 </section>;
}
