import { useEffect, useState } from 'react';
import { api, readSession, writeSession, validSession, loadNewsBookmarks, type UserSession } from './lib/supabase';
type Post={id:string;headline:string;summary:string;published_at:string;sources:{name:string;url:string}[]};
type Bookmark={article_url:string;title:string;source:string;summary:string;created_at:string};
export default function BackendPanel(){
 const [session,setSession]=useState<UserSession|null>(readSession);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 const [posts,setPosts]=useState<Post[]>([]);const [bookmarks,setBookmarks]=useState<Bookmark[]>([]);const [editor,setEditor]=useState(false);
 const [headline,setHeadline]=useState('');const [summary,setSummary]=useState('');const [source,setSource]=useState('');const [link,setLink]=useState('');
 async function loadPosts(token?:string){const rows=await api('/rest/v1/stories?status=eq.published&select=id,headline,summary,published_at,sources&order=published_at.desc','GET',undefined,token);setPosts(rows||[]);}
 async function loadSaved(){try{setBookmarks(await loadNewsBookmarks());}catch(e){setMessage(e instanceof Error?e.message:'Could not load saved articles.');}}
 useEffect(()=>{void loadPosts().catch(e=>setMessage(e.message));void validSession().then(async current=>{setSession(current);if(current){const roles=await api('/rest/v1/editors?user_id=eq.'+current.user.id+'&select=user_id','GET',undefined,current.access_token);setEditor(roles.length>0);await loadSaved();}}).catch(e=>setMessage(e.message));},[]);
 async function authenticate(signup:boolean){
  setBusy(true);setMessage('');
  try{
   const result=await api(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password','POST',{email,password});
   setPassword('');
   if(result.access_token&&result.user){
    const next:UserSession={...result,expires_at:Math.floor(Date.now()/1000)+(result.expires_in||3600)};
    writeSession(next);setSession(next);
    const roles=await api('/rest/v1/editors?user_id=eq.'+result.user.id+'&select=user_id','GET',undefined,result.access_token);
    setEditor(roles.length>0);await loadSaved();setMessage('Signed in. Your session will be restored when you return.');
   }else setMessage('Check your email to confirm your account, then sign in.');
  }catch(e){setMessage(e instanceof Error?e.message:'Authentication failed.');}finally{setBusy(false);}
 }
 async function signOut(){setBusy(true);try{const current=await validSession();if(current)await api('/auth/v1/logout','POST',undefined,current.access_token);}catch{}writeSession(null);setSession(null);setEditor(false);setBookmarks([]);setMessage('Signed out.');setBusy(false);}
 async function publish(){setBusy(true);setMessage('');try{
  const current=await validSession();if(!current||!editor)throw new Error('An assigned editor account is required.');
  const parsed=new URL(link);if(!['https:','http:'].includes(parsed.protocol))throw new Error('Use an HTTP or HTTPS source URL.');
  if(!headline.trim()||!summary.trim()||!source.trim())throw new Error('Complete all story fields.');
  await api('/rest/v1/stories','POST',{headline:headline.trim(),summary:summary.trim(),body:[summary.trim()],author_id:current.user.id,sources:[{name:source.trim(),url:parsed.href}],status:'published',published_at:new Date().toISOString()},current.access_token,'return=representation');
  await loadPosts(current.access_token);setHeadline('');setSummary('');setMessage('Published to the shared database.');
 }catch(e){setMessage(e instanceof Error?e.message:'Publish failed.');}finally{setBusy(false);}}
 return <section className="app dashboard"><h1>The Daily Drop · Connected edition</h1><p className="meta">Your reader account and saved live articles sync through the Daily Drop database. Demo stories remain separate.</p>
 {!session?<form onSubmit={e=>{e.preventDefault();void authenticate(false);}}><label>Email<input type="email" required value={email} autoComplete="email" onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required minLength={8} value={password} autoComplete="current-password" onChange={e=>setPassword(e.target.value)}/></label><button className="tab" disabled={busy} type="submit">Sign in</button> <button className="tab" disabled={busy||!email||password.length<8} type="button" onClick={()=>void authenticate(true)}>Create account</button></form>:<div><p>Signed in as {session.user.email}</p><button className="tab" disabled={busy} onClick={()=>void signOut()}>Sign out</button>{!editor&&<p className="meta">Reader account. Publishing requires editor assignment by the project owner.</p>}</div>}
 <p role="status">{message}</p>
 {session&&<section className="panel"><h2>Saved live articles ({bookmarks.length})</h2>{bookmarks.length?bookmarks.map(item=><article className="sources" key={item.article_url}><h3>{item.title}</h3><p className="meta">{item.source} · Saved {new Date(item.created_at).toLocaleDateString()}</p><a className="source" href={item.article_url} target="_blank" rel="noopener noreferrer">Open publisher ↗</a></article>):<p>No saved live articles yet. Use Save on a live headline.</p>}<button className="tab" disabled={busy} onClick={()=>void loadSaved()}>Refresh saved articles</button></section>}
 {editor&&<form onSubmit={e=>{e.preventDefault();void publish();}}><h2>Publish a sourced story</h2><label>Headline<input required value={headline} onChange={e=>setHeadline(e.target.value)}/></label><label>Story<textarea required value={summary} onChange={e=>setSummary(e.target.value)}/></label><label>Source name<input required value={source} onChange={e=>setSource(e.target.value)}/></label><label>Source URL<input required type="url" value={link} onChange={e=>setLink(e.target.value)}/></label><button className="primary" disabled={busy}>Publish to all readers</button></form>}
 <h2>Published stories · Shared database</h2><button className="tab" disabled={busy} onClick={()=>void loadPosts(session?.access_token).catch(e=>setMessage(e.message))}>Refresh stories</button>{!posts.length&&<p>No stories published yet.</p>}{posts.map(p=><article className="sources" key={p.id}><h2>{p.headline}</h2><p className="meta">{p.published_at?new Date(p.published_at).toLocaleString():''}</p><p style={{whiteSpace:'pre-wrap'}}>{p.summary}</p>{Array.isArray(p.sources)&&p.sources.map((s,i)=><a key={i} className="source" href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>)}</article>)}
 </section>;
}
