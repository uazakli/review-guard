-- Supabase'da "reviews" tablosundaki UPDATE politikasında söz dizimi hatası var.
-- Mevcut hatalı politikayı silip doğrusunu ekliyoruz.

drop policy if exists "Users can update own reviews via account." on reviews;

create policy "Users can update own reviews via account." on reviews
  for update using (
    exists (
      select 1 from accounts
      where accounts.id = account_id  -- "reviews.account_id" yerine sadece "account_id"
      and accounts.user_id = (select auth.uid())
    )
  );
