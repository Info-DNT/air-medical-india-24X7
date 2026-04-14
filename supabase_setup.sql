-- Supabase SQL to create the quotations table
-- Run this in the Supabase SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow public inserts (anonymous lead generation)
-- WARNING: This allows anyone to insert. For better security, you could 
-- add a CAPTCHA or use a function.
CREATE POLICY "Allow public inserts" ON public.quotations
    FOR INSERT 
    WITH CHECK (true);

-- 4. Create a policy to allow authenticated users (admin) to view data
CREATE POLICY "Allow admin to view" ON public.quotations
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- 5. (Optional) Add a comment to the table
COMMENT ON TABLE public.quotations IS 'Leads generated from the Air Medical India website quote form.';
