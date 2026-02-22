-- Create subscriptions table
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lemonsqueezy_subscription_id text unique,
  lemonsqueezy_customer_id text,
  lemonsqueezy_variant_id text,
  status text check (status in ('on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired')),
  renews_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table subscriptions enable row level security;

-- Policies
create policy "Users can view own subscription." on subscriptions
  for select using ((select auth.uid()) = user_id);
