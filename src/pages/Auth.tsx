import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { ScanTrialPopup } from '@/components/landing/ScanTrialPopup';
import { supabase } from '@/integrations/supabase/client';
import { useConversionTracking } from '@/hooks/useConversionTracking';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTrialPopup, setShowTrialPopup] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Trial form fields
  const [trialFormData, setTrialFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [searchParams] = useSearchParams();
  const { trackFormStart, trackFormCompletion, trackFormAbandonment } = useConversionTracking();

  useEffect(() => {
    if (user) {
      // Don't automatically redirect to onboarding - user needs trial/payment
      navigate('/');
    }
    
    // Check if coming from scan results with trial mode
    const mode = searchParams.get('mode');
    if (mode === 'trial') {
      setShowTrialPopup(true);
    }
  }, [user, navigate, searchParams]);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully"
      });
    }
    setLoading(false);
  };

  const handleTrialSignup = async () => {
    if (loading) return;
    
    setLoading(true);
    setSubmitError(null);
    
    try {
      // Validate required fields
      if (!trialFormData.name || !trialFormData.email || !trialFormData.phone || !trialFormData.businessType) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Submitting trial data:', trialFormData);

      const { data, error } = await supabase.functions.invoke('create-trial-rate-lock-checkout', {
        body: trialFormData,
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || 'Failed to create trial');
      }
      
      if (data?.url) {
        console.log('Redirecting to Stripe:', data.url);
        // Track successful form completion
        trackFormCompletion('auth_trial_signup', trialFormData);
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received:', data);
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to start trial');
      toast({
        title: "Trial signup failed",
        description: error instanceof Error ? error.message : 'Failed to start trial',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Syngularity Labs</h1>
          <p className="text-muted-foreground mt-2">Access your client onboarding dashboard</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Start Free Trial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gudmedia.co.uk"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <Button 
                  onClick={handleSignIn}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <div className="text-center mb-3">
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mb-2 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Free Trial + Lock £97 Rate Before July 31st
                  </Badge>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2 justify-center">
                    <UserPlus className="h-5 w-5" />
                    Start Your 14-Day Free Trial
                  </CardTitle>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Try our system risk-free for 14 days, then pay just £97/month locked forever
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                    <span className="text-xs">14 days free + £97/month locked rate for life</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
                    <Clock className="h-3 w-3 text-brand-orange flex-shrink-0" />
                    <span className="text-xs font-medium">Rate lock expires July 31st - secure yours now!</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="trial-name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="trial-name"
                    value={trialFormData.name}
                    onChange={(e) => setTrialFormData({ ...trialFormData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="mt-1"
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="trial-email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="trial-email"
                    type="email"
                    value={trialFormData.email}
                    onChange={(e) => setTrialFormData({ ...trialFormData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="trial-phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="trial-phone"
                    type="tel"
                    value={trialFormData.phone}
                    onChange={(e) => setTrialFormData({ ...trialFormData, phone: e.target.value })}
                    placeholder="07xxx xxx xxx"
                    required
                    className="mt-1"
                    autoComplete="tel"
                    inputMode="tel"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="trial-businessType" className="text-sm font-medium">Business Type *</Label>
                  <Select 
                    value={trialFormData.businessType} 
                    onValueChange={(value) => setTrialFormData({ ...trialFormData, businessType: value })}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumber">Plumber</SelectItem>
                      <SelectItem value="electrician">Electrician</SelectItem>
                      <SelectItem value="heating">Heating Engineer</SelectItem>
                      <SelectItem value="builder">Builder</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {submitError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {submitError}
                  </div>
                )}

                <Button 
                  onClick={handleTrialSignup}
                  disabled={loading}
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Setting up your trial...' : 'Start Free Trial & Lock £97 Rate'}
                </Button>

                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  14 days free, then £97/month locked forever. Cancel anytime during trial.
                  <br />Rate lock expires July 31st (normally £247/month)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trial popup for scan-based signups */}
      <ScanTrialPopup 
        isOpen={showTrialPopup} 
        onClose={() => setShowTrialPopup(false)} 
      />
    </div>
  );
};