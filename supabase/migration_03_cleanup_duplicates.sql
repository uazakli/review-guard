-- 1. Tekrar eden (duplicate) hesapları temizle, her lokasyon için sadece EN SON ekleneni tut.
-- "created_at" tarihine bakarak en yenisini bırakıp eskilerini siliyoruz.

delete from accounts
where id not in (
  select id
  from (
     select id,
            row_number() over (partition by user_id, google_location_id order by created_at desc) as rn
     from accounts
  ) as t
  where t.rn = 1
);

-- 2. Bundan sonra aynı işletmenin tekrar eklenmesini önlemek için kısıtlama (constraint) ekle.
alter table accounts
add constraint unique_account_per_location unique (user_id, google_location_id);
