import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useConversionTracking } from "@/hooks/useConversionTracking";

interface TrialPopupProps {
  children: React.ReactNode;
}

export const TrialPopup = ({ children }: TrialPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: ""
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { trackFormStart, trackFormCompletion, trackFormAbandonment } = useConversionTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.businessType) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Submitting trial data:', formData);

      const { data, error } = await supabase.functions.invoke('create-trial-rate-lock-checkout', {
        body: formData,
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || 'Failed to create trial');
      }
      
      if (data?.url) {
        console.log('Redirecting to Stripe:', data.url);
        // Track successful form completion
        trackFormCompletion('trial_popup', formData);
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received:', data);
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to start trial');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track form start when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      trackFormStart('trial_popup');
    } else if (!isSubmitting && formData.name) {
      // Track abandonment if form was started but not completed
      trackFormAbandonment('trial_popup', 'dialog_close');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-lg md:max-w-xl max-h-[95vh] overflow-y-auto m-2 rounded-lg">
        <DialogHeader>
          <div className="text-center mb-3">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mb-2 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Free Trial + Lock £97 Rate Before July 31st</span>
              <span className="sm:hidden">Free Trial + £97 Rate Lock</span>
            </Badge>
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
              <span className="hidden sm:inline">Start Your 14-Day Free Trial & Lock Your Rate</span>
              <span className="sm:hidden">Start Free Trial & Lock Rate</span>
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">Try our system risk-free for 14 days, then pay just £97/month locked forever (normally £247/month)</span>
              <span className="sm:hidden">14 days free, then £97/month locked forever</span>
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
            <span className="text-xs">14 days free + £97/month locked rate for life</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-brand-orange flex-shrink-0" />
            <span className="text-xs font-medium">Rate lock expires July 31st - secure yours now!</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              required
              className="mt-1 touch-target text-base"
              autoComplete="name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="mt-1 touch-target text-base"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07xxx xxx xxx"
              required
              className="mt-1 touch-target text-base"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div>
            <Label htmlFor="businessType" className="text-sm font-medium">Business Type *</Label>
            <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
              <SelectTrigger className="mt-1 touch-target">
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
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground disabled:opacity-50 touch-target font-semibold"
          >
            {isSubmitting ? 'Setting up your trial...' : (
              <>
                <span className="hidden sm:inline">Start Free Trial & Lock £97 Rate</span>
                <span className="sm:hidden">Start Trial & Lock £97</span>
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            14 days free, then £97/month locked forever. Cancel anytime during trial.
            <br />Rate lock expires July 31st (normally £247/month)
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};