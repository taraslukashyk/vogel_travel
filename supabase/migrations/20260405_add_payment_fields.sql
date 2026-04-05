-- Add price and is_for_payment to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_for_payment BOOLEAN DEFAULT FALSE;
