import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, TrendingUp } from "lucide-react";
import { TrialPopup } from "./TrialPopup";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { CalendarBooking } from "../calendar/CalendarBooking";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";
import { useABTest, trackConversion } from "@/hooks/useABTesting";
import { useScrollTracking } from "@/hooks/useScrollTracking";

export const Hero = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });
  const headlineTest = useABTest('hero_headline');
  const ctaTest = useABTest('cta_button');
  
  useScrollTracking();
  
  const reviewCount = useCountUp(25, 2000, statsVisible);
  const starRating = useCountUp(45, 2000, statsVisible);
  const profileViews = useCountUp(2, 1500, statsVisible);
  const directoryListings = useCountUp(50, 2500, statsVisible);

  const getHeadlineText = () => {
    switch (headlineTest.variant) {
      case 'Get Predictable Leads Every Month':
        return (
          <>
            Get Predictable Leads Every Month:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
      case 'Beat Your Competitors at Their Own Game':
        return (
          <>
            Beat Your Competitors at Their Own Game:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
      default:
        return (
          <>
            End the Feast-or-Famine Cycle:<br />
            <span className="text-primary">25+ Reviews, 4.5+ Stars</span><br />
            in 90 Days - Guaranteed
          </>
        );
    }
  };

  const handleCTAClick = () => {
    trackConversion('cta_click', 'hero', { 
      variant: ctaTest.variant,
      headline_variant: headlineTest.variant 
    });
  };

  return (
    <section className="pt-20 md:pt-24 pb-12 md:pb-16 mobile-padding" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center">
          {/* Mobile-optimized badge */}
          <div className="mb-4 md:mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/10 rounded-full px-3 py-2 md:px-4 inline-block text-xs md:text-sm font-medium" role="banner">
            <span className="block md:hidden">£97/Month For Life</span>
            <span className="hidden md:block">Limited Time: Lock £97/Month Rate For Life (Usually £247/month)</span>
          </div>
          
          {/* Mobile-first headlines */}
          <h1 id="hero-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight px-2">
            {getHeadlineText()}
          </h1>
          
          {/* Mobile-optimized description */}
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Stop chasing customers for reviews and worrying about your next job. Our AI-powered automation system generates consistent 5-star reviews and doubles your Google visibility - so you never run out of leads again.
          </p>
          
          {/* Mobile-first CTA buttons */}
          <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-12 px-2">
            <TrialPopup>
              <Button 
                size="lg" 
                className="w-full md:w-auto bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-6 md:px-8 py-4 text-base md:text-lg btn-hover-effect touch-target font-semibold"
                onClick={handleCTAClick}
                id="hero-primary-cta"
              >
                {ctaTest.variant}
              </Button>
            </TrialPopup>
            <CalendarBooking>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto px-6 md:px-8 py-4 text-base md:text-lg btn-hover-effect touch-target border-2"
              >
                Book Discovery Call
              </Button>
            </CalendarBooking>
          </div>
          
          {/* Mobile-optimized trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 text-sm text-muted-foreground mb-8 md:mb-0">
            <div className="flex items-center justify-center gap-2 touch-target">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-center sm:text-left">No contracts or setup fees</span>
            </div>
            <div className="flex items-center justify-center gap-2 touch-target">
              <Star className="h-5 w-5 text-warning flex-shrink-0" />
              <span className="text-center sm:text-left">4.9/5 average client rating</span>
            </div>
            <div className="flex items-center justify-center gap-2 touch-target">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-center sm:text-left">90-day money-back guarantee</span>
            </div>
          </div>
        </header>
        
        {/* Mobile-optimized results card */}
        <div className="mt-8 md:mt-16">
          <Card 
            ref={statsRef}
            className={`p-4 md:p-8 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10 transition-all duration-1000 ${
              statsVisible ? 'animate-fade-in' : 'opacity-0 translate-y-10'
            }`} 
            role="region" 
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className="sr-only">Guaranteed Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div className="touch-target">
                <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-1 md:mb-2" aria-label={`${reviewCount} plus`}>
                  {reviewCount}+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">New Reviews</div>
              </div>
              <div className="touch-target">
                <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-1 md:mb-2" aria-label={`${starRating/10} plus stars`}>
                  {(starRating/10).toFixed(1)}+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Star Average</div>
              </div>
              <div className="touch-target">
                <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-1 md:mb-2" aria-label={`${profileViews} times more`}>
                  {profileViews}x
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Profile Views</div>
              </div>
              <div className="touch-target">
                <div className="text-2xl md:text-3xl font-bold text-brand-blue mb-1 md:mb-2" aria-label={`${directoryListings} plus`}>
                  {directoryListings}+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Directory Listings</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};