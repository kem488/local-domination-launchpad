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
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center">
          <div className="mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/10 rounded-full px-4 py-2 inline-block text-sm font-medium" role="banner">
            Limited Time: Lock £97/Month Rate For Life (Usually £247/month)
          </div>
          
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {getHeadlineText()}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop chasing customers for reviews and worrying about your next job. Our AI-powered automation system generates consistent 5-star reviews and doubles your Google visibility - so you never run out of leads again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <TrialPopup>
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
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
                className="px-8 py-4 text-lg btn-hover-effect"
              >
                Book Discovery Call
              </Button>
            </CalendarBooking>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>No contracts or setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span>4.9/5 average client rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>90-day money-back guarantee</span>
            </div>
          </div>
        </header>
        
        <div className="mt-16">
          <Card 
            ref={statsRef}
            className={`p-8 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10 transition-all duration-1000 ${
              statsVisible ? 'animate-fade-in' : 'opacity-0 translate-y-10'
            }`} 
            role="region" 
            aria-labelledby="results-heading"
          >
            <h2 id="results-heading" className="sr-only">Guaranteed Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2" aria-label={`${reviewCount} plus`}>
                  {reviewCount}+
                </div>
                <div className="text-muted-foreground">New Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2" aria-label={`${starRating/10} plus stars`}>
                  {(starRating/10).toFixed(1)}+
                </div>
                <div className="text-muted-foreground">Star Average</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2" aria-label={`${profileViews} times more`}>
                  {profileViews}x
                </div>
                <div className="text-muted-foreground">Profile Views</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2" aria-label={`${directoryListings} plus`}>
                  {directoryListings}+
                </div>
                <div className="text-muted-foreground">Directory Listings</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};