-- Add email subject and body fields to offer_templates
ALTER TABLE public.offer_templates ADD COLUMN IF NOT EXISTS email_subject TEXT;
ALTER TABLE public.offer_templates ADD COLUMN IF NOT EXISTS email_body TEXT;
