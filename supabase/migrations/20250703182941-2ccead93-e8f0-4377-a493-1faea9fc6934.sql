-- Create business_scans table to store scan results and lead data
CREATE TABLE public.business_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_location TEXT NOT NULL,
  google_place_id TEXT,
  email TEXT,
  phone TEXT,
  postcode TEXT,
  overall_score INTEGER,
  reviews_score INTEGER,
  engagement_score INTEGER,
  photos_score INTEGER,
  completeness_score INTEGER,
  scan_status TEXT DEFAULT 'pending',
  scan_results JSONB,
  ai_recommendations TEXT,
  lead_qualified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scan_reports table for detailed analysis data
CREATE TABLE public.scan_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES business_scans(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (lead magnet should be accessible to everyone)
CREATE POLICY "Anyone can create business scans" 
ON public.business_scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view business scans" 
ON public.business_scans 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update business scans" 
ON public.business_scans 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can create scan reports" 
ON public.scan_reports 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view scan reports" 
ON public.scan_reports 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_scans_updated_at
BEFORE UPDATE ON public.business_scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_business_scans_email ON public.business_scans(email);
CREATE INDEX idx_business_scans_created_at ON public.business_scans(created_at);
CREATE INDEX idx_scan_reports_scan_id ON public.scan_reports(scan_id);