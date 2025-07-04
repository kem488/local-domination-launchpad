-- PHASE 1: CRITICAL DATABASE OPTIMIZATIONS
-- Fix missing foreign key constraints and add performance indexes

-- 1. Add missing foreign key constraints for data integrity
ALTER TABLE client_onboarding 
ADD CONSTRAINT fk_client_onboarding_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE client_branding_assets 
ADD CONSTRAINT fk_client_branding_assets_client_id 
FOREIGN KEY (client_id) REFERENCES client_onboarding(id) ON DELETE CASCADE;

ALTER TABLE client_review_settings 
ADD CONSTRAINT fk_client_review_settings_client_id 
FOREIGN KEY (client_id) REFERENCES client_onboarding(id) ON DELETE CASCADE;

ALTER TABLE client_team_members 
ADD CONSTRAINT fk_client_team_members_client_id 
FOREIGN KEY (client_id) REFERENCES client_onboarding(id) ON DELETE CASCADE;

ALTER TABLE email_sequences 
ADD CONSTRAINT fk_email_sequences_client_id 
FOREIGN KEY (client_id) REFERENCES client_onboarding(id) ON DELETE CASCADE;

ALTER TABLE gbp_access_requests 
ADD CONSTRAINT fk_gbp_access_requests_client_id 
FOREIGN KEY (client_id) REFERENCES client_onboarding(id) ON DELETE CASCADE;

-- 2. Add performance indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_client_onboarding_status_created 
ON client_onboarding(status, created_at DESC) 
WHERE status IN ('active', 'trial', 'pending', 'complete');

CREATE INDEX CONCURRENTLY idx_business_scans_email_status 
ON business_scans(email, scan_status, created_at DESC) 
WHERE email IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_business_scans_qualified_leads 
ON business_scans(lead_qualified, created_at DESC) 
WHERE lead_qualified = true;

CREATE INDEX CONCURRENTLY idx_gbp_access_requests_status 
ON gbp_access_requests(status, created_at DESC);

-- 3. Add GIN indexes for JSON operations
CREATE INDEX CONCURRENTLY idx_client_onboarding_wizard_data_gin 
ON client_onboarding USING GIN(wizard_data) 
WHERE wizard_data IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_business_scans_results_gin 
ON business_scans USING GIN(scan_results) 
WHERE scan_results IS NOT NULL;

-- 4. Add validation constraints for data integrity
ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_phone_format 
CHECK (phone ~ '^(\+44|0)[0-9]{10,11}$' OR phone IS NULL);

ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_postcode_format 
CHECK (postcode ~ '^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$' OR postcode IS NULL);

ALTER TABLE client_onboarding 
ADD CONSTRAINT chk_website_format 
CHECK (website_url ~ '^https?://' OR website_url IS NULL);

-- 5. Add check constraints for score ranges
ALTER TABLE business_scans 
ADD CONSTRAINT chk_scores_range 
CHECK (
  (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)) AND
  (reviews_score IS NULL OR (reviews_score >= 0 AND reviews_score <= 100)) AND
  (engagement_score IS NULL OR (engagement_score >= 0 AND engagement_score <= 100)) AND
  (photos_score IS NULL OR (photos_score >= 0 AND photos_score <= 100)) AND
  (completeness_score IS NULL OR (completeness_score >= 0 AND completeness_score <= 100))
);