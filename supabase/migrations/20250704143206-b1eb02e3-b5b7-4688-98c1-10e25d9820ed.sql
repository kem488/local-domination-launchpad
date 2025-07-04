-- PHASE 1B: Add lenient validation constraints for data integrity
-- These constraints allow existing data while preventing obviously invalid new data

-- Email validation constraint
ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_email_basic_format 
CHECK (owner_email ~ '@' AND length(owner_email) > 3);

ALTER TABLE business_scans 
ADD CONSTRAINT chk_email_basic_format 
CHECK (email IS NULL OR (email ~ '@' AND length(email) > 3));

-- Basic website format validation (more lenient)
ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_website_basic_format 
CHECK (website_url IS NULL OR length(website_url) > 3);

-- Score range validation for business_scans
ALTER TABLE business_scans 
ADD CONSTRAINT chk_scores_range 
CHECK (
  (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)) AND
  (reviews_score IS NULL OR (reviews_score >= 0 AND reviews_score <= 100)) AND
  (engagement_score IS NULL OR (engagement_score >= 0 AND engagement_score <= 100)) AND
  (photos_score IS NULL OR (photos_score >= 0 AND photos_score <= 100)) AND
  (completeness_score IS NULL OR (completeness_score >= 0 AND completeness_score <= 100))
);

-- Add team size validation
ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_team_size_positive 
CHECK (team_size IS NULL OR team_size > 0);