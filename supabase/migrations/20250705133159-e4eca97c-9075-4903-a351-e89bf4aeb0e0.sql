
-- Phase 1: Standardize Data Structure
-- Fix existing records that might have inconsistent field names
UPDATE business_scans 
SET ai_recommendations = jsonb_set(
  COALESCE(ai_recommendations::jsonb, '{}'::jsonb),
  '{profileGaps}',
  COALESCE((ai_recommendations::jsonb->'competitiveRisk'), (ai_recommendations::jsonb->'profileGaps'), '"Profile optimization opportunities available"'::jsonb)
)
WHERE ai_recommendations IS NOT NULL 
AND ai_recommendations != ''
AND ai_recommendations != 'null';

-- Remove any old competitiveRisk fields to avoid confusion
UPDATE business_scans 
SET ai_recommendations = (ai_recommendations::jsonb - 'competitiveRisk')::text
WHERE ai_recommendations IS NOT NULL 
AND ai_recommendations != ''
AND ai_recommendations != 'null'
AND ai_recommendations::jsonb ? 'competitiveRisk';

-- Add an index to improve AI recommendations lookup performance
CREATE INDEX IF NOT EXISTS idx_business_scans_ai_recommendations 
ON business_scans USING GIN (ai_recommendations jsonb_path_ops) 
WHERE ai_recommendations IS NOT NULL;

-- Enable real-time for business_scans table
ALTER TABLE business_scans REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE business_scans;
