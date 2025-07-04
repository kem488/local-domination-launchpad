-- Fix critical RLS policy vulnerabilities
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

-- Only allow viewing scans by email match or authenticated users who own them
CREATE POLICY "Users can view scans by email" 
ON public.business_scans 
FOR SELECT 
USING (
  -- Allow if user provided email matches scan email
  (email IS NOT NULL AND email = current_setting('request.jwt.claims', true)::json->>'email') OR
  -- Allow if authenticated user matches scan creator (if we add user_id later)
  (auth.uid() IS NOT NULL AND auth.uid()::text = created_by_user_id) OR
  -- Allow admin access (if user has admin role)
  (auth.uid() IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
);

-- Only allow updates by scan creator or admin
CREATE POLICY "Scan creators can update their scans" 
ON public.business_scans 
FOR UPDATE 
USING (
  -- Allow if authenticated user created the scan
  (auth.uid() IS NOT NULL AND auth.uid()::text = created_by_user_id) OR
  -- Allow admin access
  (auth.uid() IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
);

-- Secure scan_reports access
CREATE POLICY "Users can view scan reports for their scans" 
ON public.scan_reports 
FOR SELECT 
USING (
  scan_id IN (
    SELECT id FROM public.business_scans 
    WHERE 
      (email IS NOT NULL AND email = current_setting('request.jwt.claims', true)::json->>'email') OR
      (auth.uid() IS NOT NULL AND auth.uid()::text = created_by_user_id) OR
      (auth.uid() IS NOT NULL AND EXISTS(
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
      ))
  )
);

-- Add user tracking column to business_scans
ALTER TABLE public.business_scans 
ADD COLUMN IF NOT EXISTS created_by_user_id TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_scans_created_by_user ON public.business_scans(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_business_scans_session_id ON public.business_scans(session_id);

-- Create user_roles table if it doesn't exist for admin access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles (without IF NOT EXISTS)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);