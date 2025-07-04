import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoveRight, PhoneCall } from "lucide-react";
import { TrialPopup } from "./TrialPopup";
import { CalendarBooking } from "../calendar/CalendarBooking";
import { useConversionTracking } from "@/hooks/useConversionTracking";

export const Hero = () => {
  const { trackCTAClick } = useConversionTracking();

  const handleTrialClick = () => {
    trackCTAClick('Get Started Now', 'hero_primary');
  };

  const handleHealthCheckClick = () => {
    trackCTAClick('Free Google Business Health Check', 'hero_secondary');
  };

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">End the Feast-or-Famine Cycle</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                We help UK trades get to the top 3 spots of Google in their area in 90 days using AI
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Add 27+ new 5-star reviews, hit a 4.6-star rating and appear in Google's Top-3 Map Pack for your main service keyword <strong>within 90 days — or we work free until you do.</strong> Our 6-phase methodology transforms you from "Google Who?" to the go-to business customers find first.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <CalendarBooking>
                <Button 
                  size="lg" 
                  className="gap-4" 
                  variant="outline"
                  onClick={handleHealthCheckClick}
                >
                  Free Google Business Health Check <PhoneCall className="w-4 h-4" />
                </Button>
              </CalendarBooking>
              <TrialPopup>
                <Button 
                  size="lg" 
                  className="gap-4 bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground"
                  onClick={handleTrialClick}
                >
                  Get Started Now <MoveRight className="w-4 h-4" />
                </Button>
              </TrialPopup>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-muted rounded-md aspect-square flex items-center justify-center">
              <img 
                src="/api/placeholder/300/300" 
                alt="Google Business Profile optimization dashboard showing 5-star reviews"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="bg-muted rounded-md row-span-2 flex items-center justify-center">
              <img 
                src="/api/placeholder/300/600" 
                alt="UK trades business ranking #1 on Google Maps search results"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="bg-muted rounded-md aspect-square flex items-center justify-center">
              <img 
                src="/api/placeholder/300/300" 
                alt="AI-powered review management system generating customer testimonials"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};