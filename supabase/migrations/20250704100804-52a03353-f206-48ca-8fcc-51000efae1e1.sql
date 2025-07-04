-- Create user_roles table and security monitoring
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add rate limiting and security monitoring
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert security logs (for rate limiting)
CREATE POLICY "Allow security log creation" 
ON public.security_logs 
FOR INSERT 
WITH CHECK (true);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_address, endpoint, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow system to manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint ON public.rate_limits(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);