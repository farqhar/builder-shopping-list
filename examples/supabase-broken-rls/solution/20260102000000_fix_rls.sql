-- SOLUTION for the deliberately broken example. Apply after 20260101000000_init.sql.
-- Kept outside supabase/migrations/ so the example stays broken for practice.

-- orders (R1, R8): RLS on, reset grants, owner-only policies.
alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;
grant select, insert on table public.orders to authenticated;
create policy "Users can read their own orders"
on public.orders for select to authenticated
using ( (select auth.uid()) = user_id );
create policy "Users can place their own orders"
on public.orders for insert to authenticated
with check ( (select auth.uid()) = user_id );

-- profiles (R2, R3, R8, R9): drop the open policies, owner-only access.
drop policy "Enable read access for all users" on public.profiles;
drop policy "Enable insert for everyone" on public.profiles;
revoke all on table public.profiles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
create policy "Users can read their own profile"
on public.profiles for select to authenticated
using ( (select auth.uid()) = id );
create policy "Users can create their own profile"
on public.profiles for insert to authenticated
with check ( (select auth.uid()) = id );
create policy "Users can edit their own profile"
on public.profiles for update to authenticated
using ( (select auth.uid()) = id )
with check ( (select auth.uid()) = id );

-- order_summaries (R7, R8): respect RLS on orders, read-only.
alter view public.order_summaries set (security_invoker = true);
revoke all on table public.order_summaries from anon, authenticated;
grant select on table public.order_summaries to authenticated;
