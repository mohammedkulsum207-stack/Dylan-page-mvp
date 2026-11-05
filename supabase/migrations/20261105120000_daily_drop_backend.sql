-- Daily Drop backend schema additions.
-- Applied to Supabase project daily-drop-mvp on 2026-11-05.
-- This file records the verified schema for reproducible setup.

create table if not exists public.reading_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, story_id)
);
create table if not exists public.followed_topics (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null check (char_length(topic) between 1 and 80),
  created_at timestamptz not null default now(),
  primary key (user_id, topic)
);
create table if not exists public.story_views (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  viewed_at timestamptz not null default now()
);
create table if not exists public.correction_requests (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  contact_email text,
  details text not null check (char_length(details) between 5 and 5000),
  status text not null default 'received'
    check (status in ('received','reviewing','resolved','declined')),
  created_at timestamptz not null default now()
);
create table if not exists public.commercial_enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  organisation text,
  enquiry_type text not null default 'advertising'
    check (enquiry_type in ('advertising','partnership','membership','other')),
  message text not null check (char_length(message) between 5 and 5000),
  status text not null default 'new'
    check (status in ('new','in_progress','closed')),
  created_at timestamptz not null default now()
);
create table if not exists public.editorial_drafts (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  category text not null check (char_length(category) between 1 and 40),
  body text not null default '',
  status text not null default 'draft'
    check (status in ('draft','submitted','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.news_engagement (
  article_key text primary key check (article_key ~ '^n[0-9a-f]{1,8}$'),
  article_url text not null,
  views bigint not null default 0 check (views >= 0),
  likes bigint not null default 0 check (likes >= 0),
  updated_at timestamptz not null default now()
);
create table if not exists public.news_article_likes (
  article_key text not null references public.news_engagement(article_key) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_key, user_id)
);
create table if not exists public.news_comments (
  id uuid primary key default gen_random_uuid(),
  article_key text not null references public.news_engagement(article_key) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 2 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists reading_history_recent_idx
  on public.reading_history(user_id, last_read_at desc);
create index if not exists story_views_story_time_idx
  on public.story_views(story_id, viewed_at desc);
create index if not exists correction_requests_story_idx
  on public.correction_requests(story_id, created_at desc);
create index if not exists commercial_enquiries_created_idx
  on public.commercial_enquiries(created_at desc);
create index if not exists editorial_drafts_editor_updated_idx
  on public.editorial_drafts(editor_id, updated_at desc);
create index if not exists news_comments_article_time_idx
  on public.news_comments(article_key, created_at desc);

alter table public.reading_history enable row level security;
alter table public.followed_topics enable row level security;
alter table public.story_views enable row level security;
alter table public.correction_requests enable row level security;
alter table public.commercial_enquiries enable row level security;
alter table public.editorial_drafts enable row level security;
alter table public.news_engagement enable row level security;
alter table public.news_article_likes enable row level security;
alter table public.news_comments enable row level security;

create policy reading_history_owner on public.reading_history
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy followed_topics_owner on public.followed_topics
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy story_views_insert_own on public.story_views
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy story_views_read_own on public.story_views
  for select to authenticated using ((select auth.uid()) = user_id);
create policy correction_submit on public.correction_requests
  for insert to anon, authenticated
  with check (user_id is null or (select auth.uid()) = user_id);
create policy correction_editors_manage on public.correction_requests
  for all to authenticated
  using (exists (select 1 from public.editors e where e.user_id = (select auth.uid())))
  with check (exists (select 1 from public.editors e where e.user_id = (select auth.uid())));
create policy commercial_submit on public.commercial_enquiries
  for insert to anon, authenticated
  with check (user_id is null or (select auth.uid()) = user_id);
create policy commercial_editors_manage on public.commercial_enquiries
  for all to authenticated
  using (exists (select 1 from public.editors e where e.user_id = (select auth.uid())))
  with check (exists (select 1 from public.editors e where e.user_id = (select auth.uid())));
create policy editorial_drafts_owner on public.editorial_drafts
  for all to authenticated using ((select auth.uid()) = editor_id)
  with check ((select auth.uid()) = editor_id);
create policy news_engagement_public_read on public.news_engagement
  for select to anon, authenticated using (true);
create policy news_article_likes_owner on public.news_article_likes
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy news_comments_public_read on public.news_comments
  for select to anon, authenticated using (true);
create policy news_comments_insert_own on public.news_comments
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy news_comments_delete_own on public.news_comments
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.reading_history, public.followed_topics to authenticated;
grant select, insert on public.story_views to authenticated;
grant insert on public.correction_requests to anon, authenticated;
grant select, insert on public.commercial_enquiries to anon, authenticated;
grant select, update, delete on public.correction_requests, public.commercial_enquiries to authenticated;
grant usage, select on sequence public.story_views_id_seq to authenticated;
grant select, insert, update, delete on public.editorial_drafts to authenticated;
grant select on public.news_engagement to anon, authenticated;
grant select, insert, delete on public.news_article_likes to authenticated;
grant select on public.news_comments to anon, authenticated;
grant insert, delete on public.news_comments to authenticated;
