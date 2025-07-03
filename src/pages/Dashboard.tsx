import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, RefreshCw, Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientRecord {
  id: string;
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  status: string;
  created_at: string;
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
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your dashboard",
          variant: "destructive"
        });
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading clients",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const handleResendRequest = async (clientId: string, businessName: string, ownerEmail: string) => {
    try {
      await supabase.functions.invoke('send-gbp-email', {
        body: {
          type: 'follow_up',
          clientId,
          recipientEmail: ownerEmail,
          businessName
        }
      });

      toast({
        title: "Follow-up sent",
        description: `Reminder email sent to ${ownerEmail}`
      });

      // Update last follow-up timestamp
      await supabase
        .from('gbp_access_requests')
        .update({ last_follow_up: new Date().toISOString() })
        .eq('client_id', clientId);

      fetchClients();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Client Dashboard</h1>
            <p className="text-muted-foreground">Manage Google Business Profile access requests</p>
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
            <Button onClick={() => navigate('/onboarding')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Clients</span>
              </div>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">Access Granted</span>
              </div>
              <div className="text-2xl font-bold text-success">
                {clients.filter(c => c.gbp_access_requests?.[0]?.status === 'granted').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="text-2xl font-bold text-warning">
                {clients.filter(c => !c.gbp_access_requests?.[0] || c.gbp_access_requests[0].status === 'sent').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Denied</span>
              </div>
              <div className="text-2xl font-bold text-destructive">
                {clients.filter(c => c.gbp_access_requests?.[0]?.status === 'denied').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first client to request Google Business Profile access.</p>
                <Button onClick={() => navigate('/onboarding')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const gbpRequest = client.gbp_access_requests?.[0];
                    return (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.business_name}</div>
                            <div className="text-sm text-muted-foreground">{client.owner_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.owner_name}</div>
                            <div className="text-sm text-muted-foreground">{client.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {gbpRequest ? getStatusBadge(gbpRequest.status) : getStatusBadge('pending')}
                        </TableCell>
                        <TableCell>{formatDate(client.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {gbpRequest?.status !== 'granted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendRequest(client.id, client.business_name, client.owner_email)}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Resend
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};