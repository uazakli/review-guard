-- Add Auto-Reply settings columns to accounts table

ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS auto_reply_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS min_star_rating int DEFAULT 4,
ADD COLUMN IF NOT EXISTS publication_mode text CHECK (publication_mode IN ('manual', 'automated', 'semi')) DEFAULT 'manual';
