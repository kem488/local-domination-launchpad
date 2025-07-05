import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin, User, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanFormProps {
  onScanStart: (businessName: string, businessLocation: string) => void;
}

export const ScanForm = ({ onScanStart }: ScanFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !businessLocation.trim()) return;
    
    setIsSubmitting(true);
    
    // Send webhook data for scan initiation
    try {
      const { error: webhookError } = await supabase.functions.invoke('send-to-make-webhook', {
        body: {
          eventType: 'business_scan_initiated',
          data: {
            businessName: businessName.trim(),
            businessLocation: businessLocation.trim(),
            timestamp: new Date().toISOString(),
            source: 'business_scan_form'
          }
        }
      });

      if (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with scan even if webhook fails
      }
    } catch (error) {
      console.error('Failed to send webhook:', error);
      // Continue with scan even if webhook fails
    }

    await onScanStart(businessName.trim(), businessLocation.trim());
    setIsSubmitting(false);
  };


  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Get Your Free Google Business Profile Audit
        </h3>
        <p className="text-muted-foreground text-base md:text-lg mb-6">
          Our AI-powered analysis will scan your Google Business Profile and reveal 
          exactly what's holding your business back from getting more calls. You'll 
          discover the specific improvements needed and get a step-by-step optimization 
          plan to maximize your local visibility.
        </p>
        
        {/* Trust Elements */}
        <div className="grid grid-cols-2 gap-2 text-xs text-success mb-6">
          <div className="flex items-center gap-1">
            <span className="text-success">✅</span>
            <span>100% Free, No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-success">✅</span>
            <span>500+ Businesses Analyzed This Week</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-success">✅</span>
            <span>Live Google Data (Not Outdated Reports)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-success">✅</span>
            <span>Instant Results in Under 30 Seconds</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <div className="space-y-2 text-left">
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business Name *
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="businessName"
              type="text"
              placeholder="e.g. Joe's Plumbing Services"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="pl-10 h-12 text-base touch-target"
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="businessLocation" className="text-sm font-medium">
            Location (City or Postcode) *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="businessLocation"
              type="text"
              placeholder="e.g. Manchester or M1 2AB"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              className="pl-10 h-12 text-base touch-target"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect touch-target h-14 font-semibold"
          disabled={isSubmitting || !businessName.trim() || !businessLocation.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing Your Business Profile...
            </div>
          ) : (
            'Audit My Business Profile Now'
          )}
        </Button>

      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        ✓ Live Google data analysis &nbsp; ✓ Profile optimization tips &nbsp; ✓ Instant insights
      </div>
    </div>
  );
};