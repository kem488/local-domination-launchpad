-- Clean up duplicate client_onboarding records, keeping the one with trial_active = true
WITH duplicates AS (
  SELECT user_id, 
         COUNT(*) as record_count,
         MAX(CASE WHEN trial_active = true THEN id END) as trial_active_id,
         MAX(CASE WHEN payment_status = 'trial_active' THEN id END) as trial_payment_id,
         MAX(created_at) as latest_created
  FROM client_onboarding 
  GROUP BY user_id 
  HAVING COUNT(*) > 1
),
records_to_keep AS (
  SELECT user_id,
         COALESCE(trial_active_id, trial_payment_id, 
                 (SELECT id FROM client_onboarding co WHERE co.user_id = duplicates.user_id ORDER BY created_at DESC LIMIT 1)
         ) as keep_id
  FROM duplicates
)
DELETE FROM client_onboarding 
WHERE id IN (
  SELECT co.id 
  FROM client_onboarding co
  JOIN records_to_keep rtk ON co.user_id = rtk.user_id
  WHERE co.id != rtk.keep_id
);

-- Add unique constraint on user_id to prevent future duplicates
ALTER TABLE client_onboarding 
ADD CONSTRAINT client_onboarding_user_id_unique UNIQUE (user_id);