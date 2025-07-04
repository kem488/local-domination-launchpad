-- Clean up duplicate client_onboarding records, keeping the one with trial_active = true or most recent
WITH duplicates AS (
  SELECT user_id, 
         COUNT(*) as record_count
  FROM client_onboarding 
  GROUP BY user_id 
  HAVING COUNT(*) > 1
),
records_to_keep AS (
  SELECT DISTINCT ON (co.user_id) co.id as keep_id, co.user_id
  FROM client_onboarding co
  JOIN duplicates d ON co.user_id = d.user_id
  ORDER BY co.user_id, 
           (CASE WHEN co.trial_active = true THEN 1 ELSE 2 END),
           (CASE WHEN co.payment_status = 'trial_active' THEN 1 ELSE 2 END),
           co.created_at DESC
)
DELETE FROM client_onboarding 
WHERE user_id IN (SELECT user_id FROM duplicates)
  AND id NOT IN (SELECT keep_id FROM records_to_keep);

-- Add unique constraint on user_id to prevent future duplicates
ALTER TABLE client_onboarding 
ADD CONSTRAINT client_onboarding_user_id_unique UNIQUE (user_id);