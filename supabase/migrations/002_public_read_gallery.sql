-- Allow anyone (anon) to read registrations for the public gallery.
-- Run this in the Supabase SQL Editor.

create policy "Public can view gallery"
  on public.tggi_registrations
  for select
  to anon, authenticated
  using (true);
