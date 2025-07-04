export interface BusinessRecord {
  id: string;
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  status: string;
  created_at: string;
  address: string;
  postcode: string;
  industry: string;
  website_url: string;
  services_offered: string[];
  wizard_completed: boolean;
  gbp_access_requests?: {
    id: string;
    status: string;
    request_url: string;
    access_granted_at: string | null;
    last_follow_up: string | null;
  }[];
}