-- Add custom_variables JSONB column to offer_templates
-- Stores an array like: [{ "key": "Department", "label": "Department", "type": "text", "required": true }]
ALTER TABLE public.offer_templates ADD COLUMN IF NOT EXISTS custom_variables JSONB DEFAULT '[]'::jsonb;

-- Add custom_variable_values JSONB column to candidate_offers
-- Stores a map like: { "Department": "Engineering", "Manager Name": "Jane Doe" }
ALTER TABLE public.candidate_offers ADD COLUMN IF NOT EXISTS custom_variable_values JSONB DEFAULT '{}'::jsonb;
