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
    <section className="mobile-padding bg-gradient-to-br from-primary/5 via-brand-blue-light to-primary/10">
      <div className="max-w-5xl mx-auto text-center space-y-12 lg:space-y-16">
        {/* Enhanced Header */}
        <div className="space-y-4 lg:space-y-6">
          <Badge variant="premium" className="text-sm font-semibold shadow-soft">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ready to Transform Your Business?</span>
            <span className="sm:hidden">Transform Your Business</span>
          </Badge>
        </div>
        
        {/* Enhanced Main Heading */}
        <div className="space-y-6 lg:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            <span className="hidden sm:inline">Built for UK Tradespeople Who Want to Dominate Local Search</span>
            <span className="sm:hidden">Dominate Local Search</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Stop wondering why your competitors always appear first on Google. 
            Our comprehensive analysis reveals their exact strategy and shows you 
            how to beat them at their own game. Used by plumbers, electricians, 
            builders, and other skilled tradespeople across the UK.
          </p>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="flex items-center justify-center gap-3 lg:gap-4 p-4 lg:p-6 card-glass rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CheckCircle className="h-6 w-6 lg:h-7 lg:w-7 text-success flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base lg:text-lg">Proven Results</span>
          </div>
          <div className="flex items-center justify-center gap-3 lg:gap-4 p-4 lg:p-6 card-glass rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <Users className="h-6 w-6 lg:h-7 lg:w-7 text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base lg:text-lg">Expert Team</span>
          </div>
          <div className="flex items-center justify-center gap-3 lg:gap-4 p-4 lg:p-6 card-glass rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <Phone className="h-6 w-6 lg:h-7 lg:w-7 text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base lg:text-lg">Free Consultation</span>
          </div>
        </div>

        {/* Enhanced Primary CTA */}
        <div className="space-y-6 lg:space-y-8">
            <ConsultationPopup>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-10 lg:px-14 py-4 lg:py-6 text-lg lg:text-2xl btn-hover-effect touch-target font-bold shadow-strong rounded-xl"
              onClick={() => handleFinalCTA('consultation_request')}
              id="final-cta-primary"
            >
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 mr-3" />
              <span className="hidden sm:inline">Get Free Consultation</span>
              <span className="sm:hidden">Get Consultation</span>
            </Button>
            </ConsultationPopup>
          
          {/* Enhanced Secondary CTA */}
          <div>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg border-2 btn-hover-effect touch-target font-semibold rounded-xl"
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

        {/* Enhanced What Happens Next Card */}
        <Card className="max-w-4xl mx-auto card-modern">
          <CardContent className="p-6 lg:p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="p-4 lg:p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                  <div className="font-bold text-primary mb-2 text-lg lg:text-xl group-hover:scale-105 transition-transform duration-300">1. Analysis</div>
                  <div className="text-muted-foreground text-sm lg:text-base">Free business scan</div>
                </div>
                <div className="p-4 lg:p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 hover:border-success/40 transition-all duration-300 group">
                  <div className="font-bold text-success mb-2 text-lg lg:text-xl group-hover:scale-105 transition-transform duration-300">2. Consultation</div>
                  <div className="text-muted-foreground text-sm lg:text-base">Strategy discussion</div>
                </div>
                <div className="p-4 lg:p-6 bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 rounded-xl border border-brand-orange/20 hover:border-brand-orange/40 transition-all duration-300 group">
                  <div className="font-bold text-brand-orange mb-2 text-lg lg:text-xl group-hover:scale-105 transition-transform duration-300">3. Growth</div>
                  <div className="text-muted-foreground text-sm lg:text-base">Implement & see results</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 lg:mt-12">
          <TrustSignals />
        </div>
      </div>
    </section>
  );
};