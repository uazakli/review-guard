-- Drop table if exists to ensure clean state
DROP TABLE IF EXISTS plans CASCADE;

-- Create plans table
CREATE TABLE plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    price numeric NOT NULL,
    currency text DEFAULT 'TL',
    limits jsonb DEFAULT '{}'::jsonb, -- e.g. { "businesses": 1, "credits": 50 }
    features jsonb DEFAULT '[]'::jsonb, -- e.g. ["Manual Approval", "Crisis Alarm"]
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for landing page)
CREATE POLICY "Public read access" ON plans FOR SELECT USING (true);

-- Seed Data
INSERT INTO plans (name, price, currency, limits, features, is_active) VALUES
(
    'Esnaf', 
    299, 
    'TL', 
    '{"businesses": 1, "credits": 50}', 
    '["Manuel Onay Modu", "Kriz Alarmı (1 Yıldız Bildirimi)", "Haftalık Rapor"]', 
    true
),
(
    'Patron', 
    449, 
    'TL', 
    '{"businesses": 3, "credits": 300}', 
    '["Esnaf Paketindeki Her Şey", "Tam Otopilot (7/24)", "Çoklu Dil Desteği (Turist)", "Duygu Analizi Grafikleri", "Öncelikli Destek"]', 
    true
);
