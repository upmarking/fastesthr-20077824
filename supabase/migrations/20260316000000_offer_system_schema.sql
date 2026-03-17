-- Create offer_templates table
CREATE TABLE IF NOT EXISTS public.offer_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    html_content TEXT NOT NULL,
    letterhead_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create candidate_offers table
CREATE TABLE IF NOT EXISTS public.candidate_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.offer_templates(id) ON DELETE SET NULL,
    offer_number TEXT NOT NULL,
    joining_date DATE NOT NULL,
    payout NUMERIC(15, 2) NOT NULL,
    token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    html_content TEXT NOT NULL,
    status TEXT DEFAULT 'sent' NOT NULL, -- sent, accepted, declined, expired
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.offer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for offer_templates
CREATE POLICY "Enable read for team members" ON public.offer_templates
    FOR SELECT TO authenticated
    USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Enable insert for team members" ON public.offer_templates
    FOR INSERT TO authenticated
    WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Enable update for team members" ON public.offer_templates
    FOR UPDATE TO authenticated
    USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Enable delete for team members" ON public.offer_templates
    FOR DELETE TO authenticated
    USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- RLS Policies for candidate_offers
CREATE POLICY "Enable read for team members" ON public.candidate_offers
    FOR SELECT TO authenticated
    USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Enable insert for team members" ON public.candidate_offers
    FOR INSERT TO authenticated
    WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Public read access for offers via token
CREATE POLICY "Enable public read via token" ON public.candidate_offers
    FOR SELECT TO anon, authenticated
    USING (true); -- We will enforce token check in the application layer or refine this if needed

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_offer_templates
    BEFORE UPDATE ON public.offer_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_candidate_offers
    BEFORE UPDATE ON public.candidate_offers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
