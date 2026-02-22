-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create settings table
create table settings (
  user_id uuid references profiles(id) on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tone text check (tone in ('professional', 'friendly', 'solution_oriented', 'witty')) default 'professional',
  language text[] default array['tr'],
  min_delay_minutes int default 30,
  max_delay_minutes int default 240,
  auto_publish_threshold int default 4
);

alter table settings enable row level security;

create policy "Users can view own settings." on settings
  for select using ((select auth.uid()) = user_id);

create policy "Users can update own settings." on settings
  for update using ((select auth.uid()) = user_id);

-- Create accounts table (Google Business Profile Connections)
create table accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  connection_method text check (connection_method in ('oauth', 'manager_invite')) not null,
  google_account_id text, -- Stores Google Account ID "accounts/X"
  google_location_id text, -- Stores Google Location ID "locations/Y"
  business_name text, -- Stores the display name "Çaylak Tost"
  manager_email text, -- Stores the email invited as manager
  access_token text, -- Encrypted or stored securely ideally, but for MVP here
  refresh_token text,
  expires_at timestamp with time zone,
  is_active boolean default true
);

alter table accounts enable row level security;

create policy "Users can view own accounts." on accounts
  for select using ((select auth.uid()) = user_id);

create policy "Users can manage own accounts." on accounts
  for all using ((select auth.uid()) = user_id);

-- Create reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references accounts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  google_review_id text unique not null,
  reviewer_name text,
  star_rating int,
  comment text,
  review_date timestamp with time zone,
  
  sentiment_score float,
  detected_language text,
  
  generated_reply text,
  reply_status text check (reply_status in ('pending', 'approved', 'rejected', 'published')) default 'pending',
  published_reply_id text -- ID of the reply on Google
);

alter table reviews enable row level security;

create policy "Users can view own reviews via account." on reviews
  for select using (
    exists (
      select 1 from accounts
      where accounts.id = reviews.account_id
      and accounts.user_id = (select auth.uid())
    )
  );

create policy "Users can update own reviews via account." on reviews
  for update using (
    exists (
      select 1 from accounts
      where accounts.id = reviews.account_id
      and accounts.user_id = (select auth.uid())
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  insert into public.settings (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
