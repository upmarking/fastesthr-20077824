-- Add pdf_url to candidate_offers
ALTER TABLE public.candidate_offers ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Create offer_letters bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('offer_letters', 'offer_letters', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for offer_letters bucket
CREATE POLICY "Enable read for team members" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'offer_letters');

CREATE POLICY "Enable insert for team members" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'offer_letters');

CREATE POLICY "Enable update for team members" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'offer_letters');

CREATE POLICY "Enable delete for team members" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'offer_letters');
