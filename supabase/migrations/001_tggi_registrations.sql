-- Run this in the Supabase SQL editor for the tggi-web project

-- 1. Create the registrations table
create table if not exists public.tggi_registrations (
  id              uuid          primary key default gen_random_uuid(),
  created_at      timestamptz   not null    default now(),
  full_name       text          not null,
  phone           text          not null,
  email           text,
  plant_name      text          not null,
  category        text          not null,
  location        text,
  first_photo_url text,
  status          text          not null    default 'active'
);

-- 2. Enable Row Level Security
alter table public.tggi_registrations enable row level security;

-- 3. Policy: anyone (public) can insert a registration
create policy "Public can register"
  on public.tggi_registrations
  for insert
  to anon, authenticated
  with check (true);

-- 4. Policy: only authenticated admins can read/update/delete
--    (relies on auth.jwt() having app_metadata.role = 'admin')
create policy "Admins can read all"
  on public.tggi_registrations
  for select
  to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

create policy "Admins can update"
  on public.tggi_registrations
  for update
  to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

create policy "Admins can delete"
  on public.tggi_registrations
  for delete
  to authenticated
  using ( (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- 5. Storage bucket: create via Supabase dashboard or with:
--    Storage → New Bucket → name: "tggi-photos", public: true
--    Then add a policy allowing anon uploads to first-photos/
