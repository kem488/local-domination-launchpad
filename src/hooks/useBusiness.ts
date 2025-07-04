import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BusinessRecord } from "@/types/business";

export const useBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyBusiness = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your dashboard",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('client_onboarding')
        .select(`
          *,
          gbp_access_requests (
            id,
            status,
            request_url,
            access_granted_at,
            last_follow_up
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBusiness(data || null);
    } catch (error: any) {
      toast({
        title: "Error loading business",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyBusiness();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyBusiness();
  };

  const handleResendRequest = async () => {
    if (!business) return;
    
    try {
      await supabase.functions.invoke('send-gbp-email', {
        body: {
          type: 'follow_up',
          clientId: business.id,
          recipientEmail: business.owner_email,
          businessName: business.business_name
        }
      });

      await supabase
        .from('gbp_access_requests')
        .update({ last_follow_up: new Date().toISOString() })
        .eq('client_id', business.id);

      toast({
        title: "Reminder sent",
        description: "We've sent a follow-up for your Google Business Profile access request"
      });

      fetchMyBusiness();
    } catch (error: any) {
      toast({
        title: "Error sending reminder",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    business,
    loading,
    refreshing,
    handleRefresh,
    handleResendRequest,
  };
};