import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";
import { TrialPopup } from "./TrialPopup";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { TrustSignals } from "../optimization/TrustSignals";
import { CountdownTimer } from "../optimization/CountdownTimer";
import { trackConversion } from "@/hooks/useABTesting";

export const CTA = () => {
  const deadlineDate = new Date('2025-07-31T23:59:59');

  const handleFinalCTA = (action: string) => {
    trackConversion('final_cta_click', 'cta_section', { action });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-brand-blue-light">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Badge variant="destructive" className="animate-pulse">
            <Clock className="h-4 w-4 mr-2" />
            Final Hours - Only 3 Spots Left!
          </Badge>
          <CountdownTimer targetDate={deadlineDate} className="text-center" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Stop the Feast-or-Famine Cycle Forever
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join 200+ UK tradespeople who've transformed from "Google Who?" to market leaders. 
          Try free for 14 days, then lock your £97/month rate forever before July 31st.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <CheckCircle className="h-6 w-6 text-success" />
            <span className="font-medium">90-Day Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-medium">Proven Results</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <Clock className="h-6 w-6 text-warning" />
            <span className="font-medium">Limited Time Only</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <TrialPopup>
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-xl btn-hover-effect"
                onClick={() => handleFinalCTA('trial_start')}
                id="final-cta-primary"
              >
                Start Free Trial & Lock £97 Rate
              </Button>
            </TrialPopup>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-xl border-2 btn-hover-effect"
              onClick={() => {
                handleFinalCTA('see_details');
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See Full Details
            </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">1. Start Trial</div>
                  <div className="text-muted-foreground">14 days completely free</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">2. Subscribe</div>
                  <div className="text-muted-foreground">£97/month locked rate</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">3. Results</div>
                  <div className="text-muted-foreground">25+ reviews in 90 days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <TrustSignals />
        </div>
      </div>
    </section>
  );
};