import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScanData } from "./BusinessScanSection";
import { Mail, Phone, MapPin, FileText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeadGateProps {
  scanData: ScanData;
  onLeadCaptured: () => void;
}

export const LeadGate = ({ scanData, onLeadCaptured }: LeadGateProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      // Send to unified webhook system
      const { error: webhookError } = await supabase.functions.invoke('send-to-make-webhook', {
        body: {
          eventType: 'lead_captured',
          data: {
            scanId: scanData.scanId,
            email: email.trim(),
            phone: phone.trim() || null,
            postcode: postcode.trim() || null,
            timestamp: new Date().toISOString(),
            source: 'lead_gate_form'
          }
        }
      });

      if (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue with lead capture even if webhook fails
      }

      // Also call the capture-lead function for database storage
      const response = await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId: scanData.scanId,
          email: email.trim(),
          phone: phone.trim() || null,
          postcode: postcode.trim() || null
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success message
        toast({
          title: "Report Sent Successfully!",
          description: "Check your email for your detailed business analysis report. It may take a few minutes to arrive.",
        });
        onLeadCaptured();
      } else {
        throw new Error(result.error || 'Failed to capture lead');
      }
    } catch (error) {
      console.error('Lead capture error:', error);
      toast({
        title: "Unable to Send Report",
        description: "There was a technical issue sending your report. Please try again or contact support if the problem continues.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-12 w-12 text-brand-orange" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Get Your Detailed Report
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Enter your details below to receive your comprehensive business analysis report with AI-powered recommendations and actionable insights.
        </p>
      </div>

      {/* What's Included */}
      <Card className="p-6 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10 max-w-md mx-auto">
        <h4 className="font-semibold text-foreground mb-4">Your detailed report includes:</h4>
        <div className="space-y-2 text-sm text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span>Complete competitor analysis with ranking data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span>AI-powered step-by-step action plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span>Revenue impact projections & ROI calculations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            <span>Custom recommendations for your trade</span>
          </div>
        </div>
      </Card>

      {/* Lead Capture Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2 text-left">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="phone"
              type="tel"
              placeholder="07123 456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="postcode" className="text-sm font-medium">
            Postcode <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="postcode"
              type="text"
              placeholder="M1 2AB"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
          disabled={isSubmitting || !email.trim()}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending Report...
            </div>
          ) : (
            <>
              Send Me My Free Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-xs text-muted-foreground space-y-1">
        <div>✅ 100% Free • No Credit Card Required</div>
        <div>🔒 Your information is secure and never shared</div>
        <div>📧 Detailed report delivered instantly to your inbox</div>
      </div>
    </div>
  );
};