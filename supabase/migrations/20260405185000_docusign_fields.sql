-- Add signing fields to candidate_offers
ALTER TABLE public.candidate_offers 
ADD COLUMN IF NOT EXISTS signed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS signature_placement jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS signed_pdf_url text;

-- Add a comment for clarity
COMMENT ON COLUMN public.candidate_offers.signature_placement IS 'Coordinates and metadata for signatures placed on the document';
