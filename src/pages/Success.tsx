import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  
  const sessionId = searchParams.get('session_id');
  const email = searchParams.get('email');
  const tempPassword = searchParams.get('temp_password');
  
  const [countdown, setCountdown] = useState(14);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 86400000); // Update daily

    return () => clearInterval(timer);
  }, []);

  // Auto-login effect
  useEffect(() => {
    const attemptAutoLogin = async () => {
      if (email && tempPassword && !user && !autoLoginAttempted) {
        setAutoLoginAttempted(true);
        setIsSigningIn(true);
        
        try {
          const { error } = await signIn(email, tempPassword);
          if (error) {
            console.error('Auto-login failed:', error);
            toast({
              title: "Welcome!",
              description: "Your account has been created. You can sign in using your email and the password we sent you.",
              duration: 8000
            });
          } else {
            toast({
              title: "Successfully signed in!",
              description: "Welcome to your trial. Let's get you set up.",
              duration: 5000
            });
            // Don't auto-redirect, let user click the button when ready
          }
        } catch (error) {
          console.error('Auto-login error:', error);
          toast({
            title: "Account created successfully",
            description: "Please check your email for login instructions.",
            duration: 8000
          });
        } finally {
          setIsSigningIn(false);
        }
      }
    };

    attemptAutoLogin();
  }, [email, tempPassword, user, autoLoginAttempted, signIn, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          {isSigningIn ? (
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
          ) : (
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          )}
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {isSigningIn ? 'Setting up your account...' : 'Welcome to Your 14-Day Free Trial!'}
          </h1>
          <Badge className="bg-success text-success-foreground mb-4">
            £97/Month Rate Locked Forever
          </Badge>
          <p className="text-xl text-muted-foreground">
            Your trial has started and your special rate is secured. You'll never pay more than £97/month, even when our prices increase.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Trial Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-primary mb-1">Today</div>
                <div className="text-muted-foreground">Trial begins - full access</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-primary mb-1">Days 1-14</div>
                <div className="text-muted-foreground">Setup & see results</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-primary mb-1">Day 15</div>
                <div className="text-muted-foreground">£97/month billing starts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gradient-to-br from-brand-blue-light to-background rounded-lg border">
            <Star className="h-8 w-8 text-warning mb-2" />
            <div className="text-2xl font-bold text-foreground">25+</div>
            <div className="text-sm text-muted-foreground">New Reviews Expected</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-brand-blue-light to-background rounded-lg border">
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">2x</div>
            <div className="text-sm text-muted-foreground">Profile Views Increase</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-brand-blue-light to-background rounded-lg border">
            <CheckCircle className="h-8 w-8 text-success mb-2" />
            <div className="text-2xl font-bold text-foreground">90</div>
            <div className="text-sm text-muted-foreground">Day Guarantee</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">What Happens Next?</h3>
          <div className="text-left max-w-md mx-auto space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <span className="text-muted-foreground">Check your email for setup instructions</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <span className="text-muted-foreground">Our team will contact you within 24 hours</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <span className="text-muted-foreground">Complete system setup in first week</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <span className="text-muted-foreground">Start seeing new reviews by day 10</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {user ? (
            <Button 
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="btn-hover-effect w-full"
            >
              Continue to Onboarding
            </Button>
          ) : (
            <>
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="btn-hover-effect w-full"
              >
                Sign In to Continue
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Homepage
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>Questions? Email us at support@mail.syngularitylabs.com</p>
          <p>Your billing will start automatically after your 14-day trial ends</p>
        </div>
      </div>
    </div>
  );
};