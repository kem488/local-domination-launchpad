import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { MobileTestimonials } from "@/components/ui/mobile-testimonials";

export const Testimonials = () => {
  const testimonials = [
    {
      id: "1",
      name: "Mark Richardson",
      business: "Richardson Plumbing, Manchester",
      avatar: "MR",
      rating: 5,
      text: "Went from feast-or-famine to consistent £8k months. The automated system brings me customers while I sleep. Never worrying about the next job again.",
      results: "Doubled leads in 30 days, 47 new reviews"
    },
    {
      id: "2",
      name: "Sarah Thompson", 
      business: "Thompson's Cleaning Services, Birmingham",
      avatar: "ST",
      rating: 5,
      text: "I was spending 3 hours a week chasing reviews. Now the system does it automatically and my rating went from 3.2 to 4.8 stars. Complete game changer.",
      results: "From 8 to 47 reviews, saved 3 hours weekly"
    },
    {
      id: "3",
      name: "David Clarke",
      business: "Clarke's Electrical, Leeds", 
      avatar: "DC",
      rating: 5,
      text: "I used to be invisible on Google. Now I'm the first electrician customers see when they search 'electrician Leeds'. Bookings up 200%.",
      results: "Page 1 rankings, 200% booking increase"
    },
    {
      id: "4",
      name: "Emma Williams",
      business: "Williams Garden Design, Bristol",
      avatar: "EW", 
      rating: 5,
      text: "£97 for lifetime access? No-brainer. One landscaping job from the extra leads paid for it 50x over. Now I'm booked solid through winter.",
      results: "Booked solid, £97 ROI in first job"
    },
    {
      id: "5",
      name: "James Mitchell",
      business: "Mitchell Roofing, Liverpool",
      avatar: "JM",
      rating: 5,
      text: "My competitors can't figure out how I suddenly got 52 five-star reviews. They're all scrambling to copy me but they're already too far behind.",
      results: "52 new reviews, market dominance"
    },
    {
      id: "6",
      name: "Lisa Roberts",
      business: "Roberts Pest Control, Newcastle", 
      avatar: "LR",
      rating: 5,
      text: "I went from Page 3 of Google to the top result for 'pest control Newcastle'. The system actually works exactly as promised.",
      results: "From invisible to #1 local ranking"
    }
  ];

  const stats = [
    { number: "200+", label: "UK Businesses Analyzed" },
    { number: "25,000+", label: "Reviews Generated" }, 
    { number: "4.8/5", label: "Average Client Rating" },
    { number: "82%", label: "See Results in 30 Days" }
  ];

  return (
    <section className="py-12 md:py-16 mobile-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 px-2">
            <span className="hidden sm:inline">Real Results from Real UK Businesses</span>
            <span className="sm:hidden">Real UK Business Results</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            See how local service businesses across the UK have transformed their online presence and grown their customer base.
          </p>
        </div>

        {/* Mobile-optimized Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center touch-target">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">{stat.number}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile-optimized Testimonials */}
        <MobileTestimonials testimonials={testimonials} />

        <div className="text-center mt-8 md:mt-12">
          <Card className="inline-block p-4 md:p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20 mx-2">
            <p className="text-base md:text-lg font-semibold text-foreground mb-2">
              <span className="hidden sm:inline">Join 200+ UK Tradespeople Who've Broken the Feast-or-Famine Cycle</span>
              <span className="sm:hidden">Join 200+ UK Tradespeople</span>
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              <span className="hidden sm:inline">While your competitors struggle with inconsistent leads, you'll have customers finding YOU first.</span>
              <span className="sm:hidden">Get customers finding YOU first.</span>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};