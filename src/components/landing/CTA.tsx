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
    <section className="py-12 md:py-16 mobile-padding bg-gradient-to-r from-primary/5 to-brand-blue-light">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center gap-3 md:gap-4 mb-6">
          <Badge variant="destructive" className="animate-pulse text-xs">
            <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Final Hours - Only 3 Spots Left!</span>
            <span className="sm:hidden">Only 3 Spots Left!</span>
          </Badge>
          <CountdownTimer targetDate={deadlineDate} className="text-center" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 px-2">
          <span className="hidden sm:inline">Stop the Feast-or-Famine Cycle Forever</span>
          <span className="sm:hidden">Stop the Feast-or-Famine Cycle</span>
        </h2>
        
        <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          Join 200+ UK tradespeople who've transformed from "Google Who?" to market leaders. 
          Try free for 14 days, then lock your £97/month rate forever before July 31st.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-background/50 rounded-lg border touch-target">
            <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-success flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">90-Day Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-background/50 rounded-lg border touch-target">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Proven Results</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 bg-background/50 rounded-lg border touch-target">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-warning flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Limited Time Only</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8 px-2">
            <TrialPopup>
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-6 md:px-8 py-4 text-base md:text-xl btn-hover-effect touch-target font-semibold"
                onClick={() => handleFinalCTA('trial_start')}
                id="final-cta-primary"
              >
                <span className="hidden sm:inline">Start Free Trial & Lock £97 Rate</span>
                <span className="sm:hidden">Start Trial & Lock £97</span>
              </Button>
            </TrialPopup>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full md:w-auto px-6 md:px-8 py-4 text-base md:text-xl border-2 btn-hover-effect touch-target"
              onClick={() => {
                handleFinalCTA('see_details');
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="hidden sm:inline">See Full Details</span>
              <span className="sm:hidden">See Details</span>
            </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-lg md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">1. Start Trial</div>
                  <div className="text-muted-foreground">14 days completely free</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">2. Subscribe</div>
                  <div className="text-muted-foreground">£97/month locked rate</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">3. Results</div>
                  <div className="text-muted-foreground">25+ reviews in 90 days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 md:mt-8">
          <TrustSignals />
        </div>
      </div>
    </section>
  );
};