-- ========================================================
-- Shree Pratham: Supabase Database Setup Script
-- ========================================================
-- 1. Go to https://supabase.com -> Click your project -> "SQL Editor"
-- 2. Paste this entire script and click "Run" (green button)
-- ========================================================

-- Create the products catalog table
create table if not exists public.products (
  id text primary key,
  vertical text not null,
  name text,
  price numeric,
  in_stock boolean default true,
  position bigint default 0,
  payload jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Allow public read & write access with anon key (protected by admin panel authentication)
drop policy if exists "Allow public read and write" on public.products;
create policy "Allow public read and write" on public.products for all using (true) with check (true);

-- Enable real-time websocket broadcast for products table
alter publication supabase_realtime add table public.products;
