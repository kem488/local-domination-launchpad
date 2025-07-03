-- Extend client_onboarding table with comprehensive fields for 8 information categories
ALTER TABLE public.client_onboarding 
ADD COLUMN website_url TEXT,
ADD COLUMN industry TEXT,
ADD COLUMN services_offered TEXT[],
ADD COLUMN target_audience TEXT,
ADD COLUMN business_hours JSONB,
ADD COLUMN social_media_links JSONB,
ADD COLUMN current_marketing_methods TEXT[],
ADD COLUMN marketing_budget_range TEXT,
ADD COLUMN primary_goals TEXT[],
ADD COLUMN pain_points TEXT[],
ADD COLUMN has_existing_gbp BOOLEAN DEFAULT false,
ADD COLUMN existing_gbp_url TEXT,
ADD COLUMN previous_agency_experience TEXT,
ADD COLUMN team_size INTEGER,
ADD COLUMN annual_revenue_range TEXT,
ADD COLUMN preferred_contact_method TEXT DEFAULT 'email',
ADD COLUMN onboarding_step INTEGER DEFAULT 1,
ADD COLUMN wizard_completed BOOLEAN DEFAULT false,
ADD COLUMN wizard_data JSONB;

-- Create client_team_members table
CREATE TABLE public.client_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_onboarding(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_branding_assets table
CREATE TABLE public.client_branding_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_onboarding(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'logo', 'brand_colors', 'style_guide', 'photos'
  asset_url TEXT,
  asset_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_response_templates table
CREATE TABLE public.ai_response_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'positive', 'negative', 'neutral', 'question'
  template_content TEXT NOT NULL,
  personality_style TEXT NOT NULL, -- 'professional', 'friendly', 'casual', 'formal'
  is_default BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_review_settings table  
CREATE TABLE public.client_review_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_onboarding(id) ON DELETE CASCADE,
  ai_responses_enabled BOOLEAN DEFAULT true,
  personality_style TEXT DEFAULT 'professional',
  custom_templates JSONB,
  response_delay_hours INTEGER DEFAULT 2,
  escalation_keywords TEXT[],
  auto_approve_positive BOOLEAN DEFAULT true,
  auto_approve_neutral BOOLEAN DEFAULT false,
  auto_approve_negative BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.client_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_branding_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_review_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for client_team_members
CREATE POLICY "Users can view team members for their clients" 
ON public.client_team_members 
FOR SELECT 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create team members for their clients" 
ON public.client_team_members 
FOR INSERT 
WITH CHECK (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update team members for their clients" 
ON public.client_team_members 
FOR UPDATE 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete team members for their clients" 
ON public.client_team_members 
FOR DELETE 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

-- Create RLS policies for client_branding_assets
CREATE POLICY "Users can view branding assets for their clients" 
ON public.client_branding_assets 
FOR SELECT 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create branding assets for their clients" 
ON public.client_branding_assets 
FOR INSERT 
WITH CHECK (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update branding assets for their clients" 
ON public.client_branding_assets 
FOR UPDATE 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete branding assets for their clients" 
ON public.client_branding_assets 
FOR DELETE 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

-- Create RLS policies for ai_response_templates
CREATE POLICY "Anyone can view default templates" 
ON public.ai_response_templates 
FOR SELECT 
USING (is_default = true OR is_custom = false);

CREATE POLICY "Users can create custom templates" 
ON public.ai_response_templates 
FOR INSERT 
WITH CHECK (is_custom = true);

-- Create RLS policies for client_review_settings
CREATE POLICY "Users can view review settings for their clients" 
ON public.client_review_settings 
FOR SELECT 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create review settings for their clients" 
ON public.client_review_settings 
FOR INSERT 
WITH CHECK (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update review settings for their clients" 
ON public.client_review_settings 
FOR UPDATE 
USING (client_id IN (
  SELECT id FROM public.client_onboarding 
  WHERE user_id = auth.uid()
));

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_client_team_members_updated_at
BEFORE UPDATE ON public.client_team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_branding_assets_updated_at
BEFORE UPDATE ON public.client_branding_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_response_templates_updated_at
BEFORE UPDATE ON public.ai_response_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_review_settings_updated_at
BEFORE UPDATE ON public.client_review_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default AI response templates
INSERT INTO public.ai_response_templates (name, category, template_content, personality_style, is_default) VALUES
('Professional Positive Response', 'positive', 'Thank you so much for taking the time to leave us this wonderful review! We''re thrilled to hear about your positive experience with our services. Your feedback means the world to us and motivates our team to continue delivering excellent service.', 'professional', true),
('Friendly Positive Response', 'positive', 'Wow, thank you for this amazing review! 😊 We''re absolutely delighted that you had such a great experience with us. Reviews like yours make our day and remind us why we love what we do!', 'friendly', true),
('Professional Negative Response', 'negative', 'Thank you for bringing this to our attention. We sincerely apologize that your experience didn''t meet your expectations. We take all feedback seriously and would appreciate the opportunity to discuss this further and make things right. Please contact us directly so we can resolve this matter promptly.', 'professional', true),
('Professional Neutral Response', 'neutral', 'Thank you for taking the time to share your feedback. We appreciate all reviews as they help us understand how we can better serve our customers. If you have any specific suggestions or concerns, please don''t hesitate to reach out to us directly.', 'professional', true),
('Casual Positive Response', 'positive', 'Thanks so much for the great review! Really happy we could help you out. Hope to see you again soon! 👍', 'casual', true);