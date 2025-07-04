import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CreditCard, Clock } from 'lucide-react';

interface PaymentProtectedRouteProps {
  children: React.ReactNode;
}

interface TrialStatus {
  hasAccess: boolean;
  reason?: string;
  message?: string;
  paymentStatus?: string;
  trialActive?: boolean;
  trialExpiresAt?: string;
}

export const PaymentProtectedRoute = ({ children }: PaymentProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) return;

      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-trial-status');
        
        if (error) {
          console.error('Error checking trial status:', error);
          setTrialStatus({
            hasAccess: false,
            reason: 'error',
            message: 'Error checking access. Please try again.'
          });
        } else {
          setTrialStatus(data);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        setTrialStatus({
          hasAccess: false,
          reason: 'error',
          message: 'Error checking access. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!trialStatus?.hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {trialStatus?.reason === 'trial_expired' ? (
                <Clock className="h-12 w-12 text-warning" />
              ) : (
                <CreditCard className="h-12 w-12 text-primary" />
              )}
            </div>
            <CardTitle className="text-xl">
              {trialStatus?.reason === 'trial_expired' ? 'Trial Expired' : 'Payment Required'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {trialStatus?.message || 'You need an active trial or subscription to access this area.'}
            </p>
            
            {trialStatus?.reason === 'trial_expired' && (
              <Badge variant="outline" className="text-warning border-warning">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Trial Ended
              </Badge>
            )}

            <div className="space-y-2 pt-4">
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};