import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, RefreshCw, Mail, Clock, CheckCircle, XCircle, Edit, LogOut, User, Globe, Phone, MapPin, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface BusinessRecord {
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

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

      // Update last follow-up timestamp
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Access Granted
        </Badge>;
      case 'denied':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Access Denied
        </Badge>;
      case 'sent':
        return <Badge variant="secondary">
          <Mail className="h-3 w-3 mr-1" />
          Request Sent
        </Badge>;
      default:
        return <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
    }
  };

  const getOnboardingProgress = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with logout */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Business Dashboard</h1>
              <p className="text-muted-foreground">Complete your business setup to get started</p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Welcome Card */}
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to Your Business Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Let's get your business set up for Google Business Profile optimization. 
                Complete the onboarding wizard to get started.
              </p>
              <Button onClick={() => navigate('/onboarding')}>
                <Settings className="h-4 w-4 mr-2" />
                Complete Business Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const gbpRequest = business.gbp_access_requests?.[0];
  const progress = getOnboardingProgress();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {business.business_name || 'My Business Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Manage your Google Business Profile and online presence
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Profile Completion</span>
              </div>
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">GBP Status</span>
              </div>
              <div className="mt-1">
                {gbpRequest ? getStatusBadge(gbpRequest.status) : getStatusBadge('pending')}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Setup Status</span>
              </div>
              <div className="text-lg font-semibold">
                {business.wizard_completed ? 'Complete' : 'In Progress'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Profile
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/onboarding')}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{business.business_name}</h4>
                <p className="text-sm text-muted-foreground">{business.industry}</p>
              </div>
              
              {business.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <div>{business.address}</div>
                    {business.postcode && <div>{business.postcode}</div>}
                  </div>
                </div>
              )}
              
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{business.phone}</span>
                </div>
              )}
              
              {business.website_url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-primary hover:underline">
                    {business.website_url}
                  </a>
                </div>
              )}
              
              {business.services_offered && business.services_offered.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Services</h5>
                  <div className="flex flex-wrap gap-1">
                    {business.services_offered.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Google Business Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Google Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Access Status</h5>
                {gbpRequest ? getStatusBadge(gbpRequest.status) : getStatusBadge('pending')}
              </div>
              
              {gbpRequest?.status === 'sent' && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    We've sent you an email to grant access to your Google Business Profile. 
                    Please check your inbox and follow the instructions.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResendRequest}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Resend Request
                  </Button>
                </div>
              )}
              
              {gbpRequest?.status === 'granted' && (
                <div className="p-3 bg-success/10 rounded-lg">
                  <p className="text-sm text-success">
                    Great! You've granted access to your Google Business Profile. 
                    Our team will now begin optimizing your listing.
                  </p>
                </div>
              )}
              
              {gbpRequest?.status === 'denied' && (
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive mb-2">
                    Access was denied. To proceed with optimization, please grant access to your profile.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleResendRequest}>
                    <Mail className="h-4 w-4 mr-1" />
                    Send New Request
                  </Button>
                </div>
              )}
              
              {!gbpRequest && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Complete your business setup to request Google Business Profile access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};