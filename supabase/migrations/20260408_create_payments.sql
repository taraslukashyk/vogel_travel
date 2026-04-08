-- Таблиця платежів для Monobank еквайрингу
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id TEXT,
  status TEXT DEFAULT 'pending',
  amount INTEGER NOT NULL,
  ccy INTEGER DEFAULT 980,
  final_amount INTEGER,
  service_id INTEGER REFERENCES services(id),
  service_title TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  reference TEXT,
  failure_reason TEXT,
  payment_info JSONB,
  monobank_modified_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: тільки service_role (edge functions) може писати
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Індекс для пошуку по invoice_id (webhook)
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);

-- Індекс для пошуку по reference
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
