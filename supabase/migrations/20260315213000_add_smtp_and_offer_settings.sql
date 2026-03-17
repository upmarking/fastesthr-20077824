-- Add SMTP settings to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS smtp_host TEXT,
ADD COLUMN IF NOT EXISTS smtp_port INTEGER,
ADD COLUMN IF NOT EXISTS smtp_user TEXT,
ADD COLUMN IF NOT EXISTS smtp_pass TEXT,
ADD COLUMN IF NOT EXISTS smtp_from_email TEXT,
ADD COLUMN IF NOT EXISTS smtp_from_name TEXT,
ADD COLUMN IF NOT EXISTS offer_sequence_prefix TEXT DEFAULT 'OFFER-',
ADD COLUMN IF NOT EXISTS offer_sequence_current INTEGER DEFAULT 0;

-- Function to safely increment and get the next offer sequence number
CREATE OR REPLACE FUNCTION increment_offer_sequence(p_company_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_next_val INTEGER;
BEGIN
    UPDATE companies
    SET offer_sequence_current = COALESCE(offer_sequence_current, 0) + 1
    WHERE id = p_company_id
    RETURNING offer_sequence_current INTO v_next_val;

    RETURN v_next_val;
END;
$$;
