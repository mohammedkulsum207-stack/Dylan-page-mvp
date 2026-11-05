const SUPABASE_URL = 'https://jqgkmtbflkdvyyoehhzx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5BZkLUow6QQg5fR9ZbOVZQ_qfB4rbgK';
const SESSION_KEY = 'daily-drop-session';
export type UserSession = { access_token:string; refresh_token:string; expires_at?:number; expires_in?:number; token_type?:string; user:{id:string;email?:string} };
export function readSession():UserSession|null {
  try {
    const value=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
    if(!value?.access_token||!value?.refresh_token||!value?.user?.id)return null;
    if(!value.expires_at){
      try{const payload=JSON.parse(atob(value.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));value.expires_at=payload.exp;}catch{}
    }
    return value;
  } catch { return null; }
}
export function writeSession(session:UserSession|null) {
  if(session) localStorage.setItem(SESSION_KEY,JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY);
}
export async function api(path:string,method='GET',body?:unknown,token?:string,prefer?:string) {
  const response=await fetch(SUPABASE_URL+path,{method,headers:{apikey:SUPABASE_KEY,...(token?{Authorization:`Bearer ${token}`}:{}),...(prefer?{Prefer:prefer}:{}),'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  const text=await response.text();let result:any=null;try{result=text?JSON.parse(text):null;}catch{throw new Error('Unexpected backend response');}
  if(!response.ok)throw new Error(result?.msg||result?.message||result?.error_description||result?.error||'Request failed');
  return result;
}
export async function validSession():Promise<UserSession|null>{
  const current=readSession();if(!current)return null;
  if(current.expires_at&&current.expires_at>Date.now()/1000+60)return current;
  try{
    const fresh=await api('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:current.refresh_token});
    const next:UserSession={...fresh,expires_at:Math.floor(Date.now()/1000)+(fresh.expires_in||3600)};
    writeSession(next);return next;
  }catch{writeSession(null);return null;}
}
export async function saveNewsBookmark(item:{link:string;title:string;source:string;summary:string},saved:boolean){
  const session=await validSession();if(!session)throw new Error('Sign in first to save articles.');
  if(saved){
    await api('/rest/v1/news_bookmarks?on_conflict=user_id,article_url','POST',{user_id:session.user.id,article_url:item.link,title:item.title,source:item.source,summary:item.summary},session.access_token,'resolution=merge-duplicates');
  }else{
    await api('/rest/v1/news_bookmarks?article_url=eq.'+encodeURIComponent(item.link),'DELETE',undefined,session.access_token);
  }
}
export async function loadNewsBookmarks(){
  const session=await validSession();if(!session)return [];
  return api('/rest/v1/news_bookmarks?select=article_url,title,source,summary,created_at&order=created_at.desc','GET',undefined,session.access_token);
}
