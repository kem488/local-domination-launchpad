-- Fix critical RLS policy vulnerabilities - Phase 1
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view business scans" ON public.business_scans;
DROP POLICY IF EXISTS "Anyone can update business scans" ON public.business_scans;
DROP POLICY IF EXISTS "Anyone can view scan reports" ON public.scan_reports;

-- Create secure policies for business_scans
-- Allow public creation for lead magnet functionality
CREATE POLICY "Public can create business scans" 
ON public.business_scans 
FOR INSERT 
WITH CHECK (true);

-- For now, allow viewing scans only by email match (until we add user tracking)
CREATE POLICY "Users can view scans by email" 
ON public.business_scans 
FOR SELECT 
USING (
  email IS NOT NULL AND email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Restrict updates to authenticated users only
CREATE POLICY "Authenticated users can update scans" 
ON public.business_scans 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Secure scan_reports access - only allow viewing reports for scans with matching email
CREATE POLICY "Users can view scan reports for their email" 
ON public.scan_reports 
FOR SELECT 
USING (
  scan_id IN (
    SELECT id FROM public.business_scans 
    WHERE email IS NOT NULL AND email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Add email validation function
CREATE OR REPLACE FUNCTION public.is_valid_email(email_address TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Add email validation constraint
ALTER TABLE public.business_scans 
ADD CONSTRAINT valid_email_format 
CHECK (email IS NULL OR public.is_valid_email(email));