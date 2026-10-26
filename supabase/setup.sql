-- Primera Flats 13: storage for the admin (no redeploy on save)
create table if not exists public.pf_data (
  name text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Only the server (service_role key) touches this table. RLS on, no policies = no public access.
alter table public.pf_data enable row level security;

-- Public bucket for member / territory photos (uploads go through the server)
insert into storage.buckets (id, name, public)
values ('pf-uploads', 'pf-uploads', true)
on conflict (id) do nothing;

-- Seed with the current site data (does not overwrite existing rows)
insert into public.pf_data (name, data) values ('members', '[{"slug": "new-member", "name": "Johnny Ramirez", "rank": "OG", "since": "Old.", "online": true, "alias": "Joker#2", "photo": "/uploads/new-member-mvp7idkw.jpg", "bio": "Do Not Disturb.", "development": ""}]'::jsonb) on conflict (name) do nothing;
insert into public.pf_data (name, data) values ('street', '[]'::jsonb) on conflict (name) do nothing;
insert into public.pf_data (name, data) values ('territory', '[]'::jsonb) on conflict (name) do nothing;
