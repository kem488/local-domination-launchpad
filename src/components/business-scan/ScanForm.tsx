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
      <div className="mb-10">
        <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
          Get Your Free Google Business Profile Health Check
        </h3>
        <p className="text-muted-foreground text-lg sm:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
          Our veteran-developed AI analyzes your Google Business Profile and reveals exactly what's holding your business back from getting more calls. You'll get specific improvement recommendations and a step-by-step optimization plan.
        </p>
        
        {/* Trust Elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
            <span className="text-success text-lg">✅</span>
            <span className="font-medium text-success">100% Free Profile Analysis</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <span className="text-primary text-lg">✅</span>
            <span className="font-medium text-primary">AI-Powered Recommendations</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 rounded-lg border border-brand-blue/20">
            <span className="text-brand-blue text-lg">✅</span>
            <span className="font-medium text-brand-blue">Live Google Business Profile Data</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20">
            <span className="text-warning text-lg">✅</span>
            <span className="font-medium text-warning">Instant Improvement Plan in 30 Seconds</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
        <div className="space-y-3 text-left">
          <Label htmlFor="businessName" className="text-base font-semibold text-foreground">
            Business Name *
          </Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="businessName"
              type="text"
              placeholder="e.g. Manchester Plumbing Services"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="pl-12 h-14 text-base touch-target"
              required
            />
          </div>
        </div>

        <div className="space-y-3 text-left">
          <Label htmlFor="businessLocation" className="text-base font-semibold text-foreground">
            Location (City or Postcode) *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="businessLocation"
              type="text"
              placeholder="e.g. Manchester or M1 2AB"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              className="pl-12 h-14 text-base touch-target"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="premium"
            size="lg"
            className="w-full px-8 py-4 text-lg btn-hover-effect touch-target h-16 font-bold text-xl"
            disabled={isSubmitting || !businessName.trim() || !businessLocation.trim()}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Your Business Profile...
              </div>
            ) : (
              'Audit My Business Profile Now'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gradient-to-r from-muted/20 to-accent/20 rounded-xl border border-border/30">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            Live profile analysis
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            AI improvement recommendations
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
            Instant optimization plan
          </span>
        </div>
      </div>
    </div>
  );
};