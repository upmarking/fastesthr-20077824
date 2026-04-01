-- Create company-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their company folder
CREATE POLICY "Company admins can upload logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.profiles WHERE id = auth.uid()
  )
);

-- Allow authenticated users to update their company logos
CREATE POLICY "Company admins can update logos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.profiles WHERE id = auth.uid()
  )
);

-- Allow public read access to logos
CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'company-logos');