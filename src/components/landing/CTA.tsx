import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, MessageSquare, Phone } from "lucide-react";
import { ConsultationPopup } from "./ConsultationPopup";
import { TrustSignals } from "../optimization/TrustSignals";
import { trackConversion } from "@/hooks/useABTesting";

export const CTA = () => {
  const handleFinalCTA = (action: string) => {
    trackConversion('final_cta_click', 'cta_section', { action });
  };

  return (
    <section className="mobile-padding">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 text-xs">
            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Ready to Transform Your Business?</span>
            <span className="sm:hidden">Transform Your Business</span>
          </Badge>
        </div>
        
        {/* Main Heading */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            <span className="hidden sm:inline">Join 200+ UK Tradespeople Already Growing</span>
            <span className="sm:hidden">Join 200+ UK Tradespeople</span>
          </h2>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop struggling with inconsistent leads. Get the professional tools and strategies that work for your trade.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="flex items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-background/50 rounded-lg border touch-target">
            <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-success flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Proven Results</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-background/50 rounded-lg border touch-target">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Expert Team</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-background/50 rounded-lg border touch-target">
            <Phone className="h-5 w-5 md:h-6 md:w-6 text-brand-orange flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Free Consultation</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="space-y-4">
            <ConsultationPopup>
            <Button 
              size="lg" 
              className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 md:px-12 py-4 text-lg md:text-xl btn-hover-effect touch-target font-semibold shadow-lg"
              onClick={() => handleFinalCTA('consultation_request')}
              id="final-cta-primary"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Get Free Consultation</span>
              <span className="sm:hidden">Get Consultation</span>
            </Button>
            </ConsultationPopup>
          
          {/* Secondary CTA - Separated with space */}
          <div className="pt-4">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full md:w-auto px-6 md:px-8 py-3 text-base border-2 btn-hover-effect touch-target"
              onClick={() => {
                handleFinalCTA('business_scan');
                document.getElementById('business-scan')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="hidden sm:inline">Start Business Analysis</span>
              <span className="sm:hidden">Business Analysis</span>
            </Button>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-lg md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">1. Analysis</div>
                  <div className="text-muted-foreground">Free business scan</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">2. Consultation</div>
                  <div className="text-muted-foreground">Strategy discussion</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg touch-target">
                  <div className="font-semibold text-primary mb-1">3. Growth</div>
                  <div className="text-muted-foreground">Implement & see results</div>
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