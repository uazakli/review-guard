-- SADECE accounts ve reviews tablolarını silip yeniden kurar.
-- Profiliniz (Giriş bilgileriniz) SİLİNMEZ.

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS accounts;

-- 1. Accounts tablosunu (Yeni kolonlarla) tekrar oluştur
create table accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  connection_method text check (connection_method in ('oauth', 'manager_invite')) not null,
  google_account_id text, 
  google_location_id text, -- YENİ: Lokasyon ID'si
  business_name text, -- YENİ: İşletme Adı (Örn: Çaylak Tost)
  manager_email text,
  access_token text, 
  refresh_token text,
  expires_at timestamp with time zone,
  is_active boolean default true
);

alter table accounts enable row level security;

create policy "Users can view own accounts." on accounts
  for select using ((select auth.uid()) = user_id);

create policy "Users can manage own accounts." on accounts
  for all using ((select auth.uid()) = user_id);

-- 2. Reviews tablosunu tekrar oluştur (Accounts'a bağlı olduğu için)
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
  published_reply_id text
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
