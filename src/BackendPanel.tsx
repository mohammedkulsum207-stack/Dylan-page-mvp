import { useState, useEffect } from 'react';
const URL = 'https://jqgkmtbflkdvyyoehhzx.supabase.co';
const KEY = 'sb_publishable_5BZkLUow6QQg5fR9ZbOVZQ_qfB4rbgK';
type Session = { access_token: string; user: { id: string; email?: string } };
type Post = { id: string; headline: string; summary: string; published_at: string; sources: {name:string;url:string}[] };
export default function BackendPanel() {
 const [session,setSession] = useState<Session|null>(null);
 const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
 const [message,setMessage] = useState(''); const [busy,setBusy] = useState(false);
 const [posts,setPosts] = useState<Post[]>([]); const [editor,setEditor] = useState(false);
 const [headline,setHeadline] = useState(''); const [summary,setSummary] = useState('');
 const [source,setSource] = useState(''); const [link,setLink] = useState('');
 async function request(path:string, method='GET', body?:unknown, token?:string) {
  const response = await fetch(URL+path,{method,headers:{apikey:KEY,...(token?{Authorization:`Bearer ${token}`} : {}),'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  const text = await response.text(); let result; try {result = text ? JSON.parse(text) : null;} catch {throw new Error('Unexpected backend response');}
  if(!response.ok) throw new Error(result?.msg || result?.message || result?.error_description || 'Request failed');
  return result;
 }
 async function load() {
  const rows = await request('/rest/v1/stories?status=eq.published&select=id,headline,summary,published_at,sources&order=published_at.desc'); setPosts(rows);
 }
 useEffect(()=>{load().catch(e=>setMessage(e.message));},[]);
 async function authenticate(signup:boolean) {
  setBusy(true);setMessage('');
  try {
   const result = await request(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password','POST',{email,password});
   setPassword('');
   if(result.access_token && result.user) {
    setSession(result); const roles = await request(`/rest/v1/editors?user_id=eq.${result.user.id}&select=user_id`,'GET',undefined,result.access_token);setEditor(roles.length>0);setMessage('Signed in. Session lasts for this page only.');
   } else setMessage('Check your email to confirm your account, then sign in.');
  } catch(e){setMessage(e instanceof Error?e.message:'Authentication failed');} finally {setBusy(false);}
 }
 async function publish() {
  setBusy(true);setMessage('');
  try {
   if(!session || !editor) throw new Error('An assigned editor account is required.');
   const parsed = new URL(link);if(!['https:','http:'].includes(parsed.protocol)) throw new Error('Use an HTTP or HTTPS source URL.');
   if(!headline.trim() || !summary.trim() || !source.trim()) throw new Error('Fill in the headline, story and source name.');
   await request('/rest/v1/stories','POST',{headline:headline.trim(),summary:summary.trim(),body:[summary.trim()],author_id:session.user.id,sources:[{name:source.trim(),url:parsed.href}],status:'published',published_at:new Date().toISOString()},session.access_token);
   await load();setHeadline('');setSummary('');setMessage('Published to the shared database.');
  }catch(e){setMessage(e instanceof Error?e.message:'Publish failed');}finally{setBusy(false);}
 }
 return <section className="app dashboard"><h1>The Daily Drop · Connected edition</h1><p className="meta">Independent concept. Live database content is separate from the sample demo below. Accounts are real; do not submit sensitive information.</p>
 {!session ? <form onSubmit={e=>{e.preventDefault();authenticate(false);}}><label>Email<input type="email" required value={email} autoComplete="email" onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} autoComplete="current-password" onChange={e=>setPassword(e.target.value)} /></label><button className="tab" disabled={busy} type="submit">Sign in</button> <button className="tab" disabled={busy || !email || password.length<8} type="button" onClick={()=>authenticate(true)}>Create account</button></form> : <div><p>Signed in as {session.user.email}</p><button className="tab" onClick={async()=>{try{await request('/auth/v1/logout','POST',undefined,session.access_token);}catch{}setSession(null);setEditor(false);setMessage('Signed out locally.');}}>Sign out</button>{!editor && <p className="meta">Reader account. Publishing requires editor assignment by the project owner.</p>}</div>}
 <p role="status">{message}</p>
 {editor && <form onSubmit={e=>{e.preventDefault();publish();}}><h2>Publish a sourced story</h2><label>Headline<input required value={headline} onChange={e=>setHeadline(e.target.value)}/></label><label>Story<textarea required value={summary} onChange={e=>setSummary(e.target.value)}/></label><label>Source name<input required value={source} onChange={e=>setSource(e.target.value)}/></label><label>Source URL<input required type="url" value={link} onChange={e=>setLink(e.target.value)}/></label><button className="primary" disabled={busy}>Publish to all readers</button></form>}
 <h2>Published stories · Shared database</h2><button className="tab" disabled={busy} onClick={()=>load().catch(e=>setMessage(e.message))}>Refresh stories</button>{!posts.length && <p>No stories published yet.</p>}{posts.map(p=><article className="sources" key={p.id}><h2>{p.headline}</h2><p className="meta">{p.published_at?new Date(p.published_at).toLocaleString():''}</p><p style={{whiteSpace:'pre-wrap'}}>{p.summary}</p><h3>Sources</h3>{Array.isArray(p.sources) && p.sources.map((s,i)=>/^https?:\/\//i.test(s.url)?<a key={i} className="source" href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>:<span key={i}>{s.name}</span>)}</article>)}<hr/><p className="meta">Below: sample-content sandbox. Its likes, saves and creator form remain browser-local.</p></section>;
}
