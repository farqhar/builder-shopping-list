-- ============================================================
-- DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
-- This migration contains planted security mistakes so you can
-- practise finding them with the supabase-rls-check skill.
-- See ../../EXPECTED-REPORT.md for the answers.
-- ============================================================


-- ------------------------------------------------------------
-- products: a public catalogue. Anyone may read, nobody may write
-- from the app. This table is set up CORRECTLY (a control).
-- ------------------------------------------------------------
create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price_cents integer not null check (price_cents >= 0)
);

alter table public.products enable row level security;
revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;

create policy "Anyone can read products"
on public.products for select
to anon, authenticated
using ( true );


-- ------------------------------------------------------------
-- notes: each user manages only their own notes.
-- This table is set up CORRECTLY (a control).
-- ------------------------------------------------------------
create table public.notes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null
);

alter table public.notes enable row level security;
revoke all on table public.notes from anon, authenticated;
grant select, insert, update, delete on table public.notes to authenticated;

create policy "Users can read their own notes"
on public.notes for select
to authenticated
using ( (select auth.uid()) = user_id );

create policy "Users can add their own notes"
on public.notes for insert
to authenticated
with check ( (select auth.uid()) = user_id );

create policy "Users can edit their own notes"
on public.notes for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own notes"
on public.notes for delete
to authenticated
using ( (select auth.uid()) = user_id );


-- ------------------------------------------------------------
-- orders: private customer orders.
-- ------------------------------------------------------------
create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id),
  shipping_address text not null,
  total_cents integer not null
);
-- (No "enable row level security" here.)


-- ------------------------------------------------------------
-- profiles: one row per user, with their email and phone.
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  phone text
);

alter table public.profiles enable row level security;

-- An AI tool added this to make a "permission denied" error go away.
create policy "Enable read access for all users"
on public.profiles for select
using ( true );

create policy "Enable insert for everyone"
on public.profiles for insert
with check ( true );


-- ------------------------------------------------------------
-- order_summaries: a view for the dashboard.
-- ------------------------------------------------------------
create view public.order_summaries as
  select user_id, count(*) as order_count, sum(total_cents) as total_spent_cents
  from public.orders
  group by user_id;
