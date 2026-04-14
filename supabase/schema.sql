-- Revivio database schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free',
  credits_remaining integer not null default 3,
  credits_per_month integer not null default 3,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'active',
  billing_interval text default 'month',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Restorations table
create table public.restorations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  status text not null default 'completed',
  original_size integer,
  mime_type text
);

alter table public.restorations enable row level security;

create policy "Users can read own restorations"
  on public.restorations for select
  using (auth.uid() = user_id);

-- 3. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, plan, credits_remaining, credits_per_month)
  values (new.id, new.email, 'free', 3, 3);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
