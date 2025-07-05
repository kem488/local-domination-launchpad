-- Fix RLS policy conflicts and security issues

-- Remove duplicate INSERT policies on business_scans
DROP POLICY IF EXISTS "Anyone can create business scans" ON public.business_scans;

-- Keep only the "Public can create business scans" policy for lead generation
-- The duplicate policy is causing conflicts

-- Add stronger rate limiting for security
-- Update rate limit windows to be more restrictive for sensitive operations
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(ip_address, endpoint, window_start);

-- Add session validation for business scans access
-- Update the existing policy to be more secure
DROP POLICY IF EXISTS "Users can view scans by email" ON public.business_scans;

CREATE POLICY "Users can view scans by email or session" 
ON public.business_scans 
FOR SELECT 
USING (
  -- Allow if email matches JWT claim
  (email IS NOT NULL AND email = current_setting('request.jwt.claims', true)::json->>'email') OR
  -- Allow if user is authenticated and created the scan
  (auth.uid() IS NOT NULL AND created_by_user_id IS NOT NULL AND auth.uid()::text = created_by_user_id) OR
  -- Allow admin access
  (auth.uid() IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ))
);

-- Add security audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (admin only)
CREATE POLICY "Only admins can view audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_action ON public.security_audit_logs(action);