import { BusinessRecord } from "@/types/business";

export const calculateOnboardingProgress = (business: BusinessRecord | null): number => {
  if (!business) return 0;
  
  let completed = 0;
  let total = 6;
  
  if (business.business_name) completed++;
  if (business.owner_name) completed++;
  if (business.phone) completed++;
  if (business.address) completed++;
  if (business.industry) completed++;
  if (business.wizard_completed) completed++;
  
  return Math.round((completed / total) * 100);
};