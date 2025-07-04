-- PHASE 1A: Add validation constraints for data integrity
ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_phone_format 
CHECK (phone ~ '^(\+44|0)[0-9]{10,11}$' OR phone IS NULL);

ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_postcode_format 
CHECK (postcode ~ '^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$' OR postcode IS NULL);

ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_website_format 
CHECK (website_url ~ '^https?://' OR website_url IS NULL);

-- Add check constraints for score ranges in business_scans
ALTER TABLE business_scans 
ADD CONSTRAINT chk_scores_range 
CHECK (
  (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)) AND
  (reviews_score IS NULL OR (reviews_score >= 0 AND reviews_score <= 100)) AND
  (engagement_score IS NULL OR (engagement_score >= 0 AND engagement_score <= 100)) AND
  (photos_score IS NULL OR (photos_score >= 0 AND photos_score <= 100)) AND
  (completeness_score IS NULL OR (completeness_score >= 0 AND completeness_score <= 100))
);