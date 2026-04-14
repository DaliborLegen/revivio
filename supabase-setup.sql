-- Revivio: tabele za profiles in restorations

-- 1. Profiles tabela
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free',
  credits_remaining integer default 3,
  credits_per_month integer default 3,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Restorations tabela
create table if not exists public.restorations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  status text default 'pending',
  original_size integer,
  mime_type text,
  created_at timestamptz default now()
);

-- 3. RLS (Row Level Security) vklopimo
alter table public.profiles enable row level security;
alter table public.restorations enable row level security;

-- 4. Politike: uporabnik vidi samo svoje podatke
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own restorations"
  on public.restorations for select
  using (auth.uid() = user_id);

-- 5. Service role lahko vse (za API route)
create policy "Service role full access profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

create policy "Service role full access restorations"
  on public.restorations for all
  using (auth.role() = 'service_role');

-- 6. Avtomatsko ustvari profil ob registraciji
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, plan, credits_remaining, credits_per_month)
  values (new.id, new.email, 'free', 1, 1);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
