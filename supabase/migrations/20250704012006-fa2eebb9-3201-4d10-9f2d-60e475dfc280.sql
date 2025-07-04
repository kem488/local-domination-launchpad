-- Add trial and payment tracking to client_onboarding table
ALTER TABLE public.client_onboarding 
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN trial_active BOOLEAN DEFAULT FALSE,
ADD COLUMN trial_expires_at TIMESTAMPTZ,
ADD COLUMN stripe_session_id TEXT;

-- Update the status enum to include payment-related statuses
-- payment_status can be: 'pending', 'trial_active', 'subscribed', 'expired', 'cancelled'

-- Create index for performance
CREATE INDEX idx_client_onboarding_payment_status ON public.client_onboarding(payment_status);
CREATE INDEX idx_client_onboarding_trial_active ON public.client_onboarding(trial_active);