-- Reviews tablosuna eksik olan INSERT (Ekleme) iznini ekler.
-- Bu sayede "Bağla" dendiğinde örnek yorumlar veritabanına yazılabilir.

create policy "Users can insert reviews for their own accounts." on reviews
  for insert with check (
    exists (
      select 1 from accounts
      where accounts.id = account_id
      and accounts.user_id = (select auth.uid())
    )
  );
