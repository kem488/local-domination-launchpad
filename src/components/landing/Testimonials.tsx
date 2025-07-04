import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { MobileTestimonials } from "@/components/ui/mobile-testimonials";
import testimonialsImage from "@/assets/testimonials.png";

export const Testimonials = () => {
  const caseStudies = [
    {
      id: "1",
      name: "Plumbing Service",
      business: "Greater Manchester Area",
      avatar: "PS",
      rating: 0, // Remove rating display for case studies
      text: "A local plumbing service struggling with inconsistent lead flow implemented our 6-phase system to automate review collection and optimize their Google Business Profile.",
      results: "Achieved consistent monthly bookings through automated review generation and improved local search visibility"
    },
    {
      id: "2",
      name: "Cleaning Company", 
      business: "West Midlands Region",
      avatar: "CC",
      rating: 0,
      text: "A cleaning service spending hours weekly chasing customer reviews automated their reputation management using our proven methodology.",
      results: "Reduced manual review management time while systematically improving online ratings"
    },
    {
      id: "3",
      name: "Electrical Contractor",
      business: "Yorkshire Region", 
      avatar: "EC",
      rating: 0,
      text: "An electrical contractor with poor Google visibility implemented our local SEO optimization and review automation system to improve search rankings.",
      results: "Achieved first-page local search rankings through systematic Google Business Profile optimization"
    },
    {
      id: "4",
      name: "Garden Design Service",
      business: "South West Region",
      avatar: "GD",
      rating: 0,
      text: "A landscaping business used our system to build consistent online presence and automate customer feedback collection during seasonal fluctuations.",
      results: "Maintained steady bookings during traditionally quiet periods through improved online visibility"
    },
    {
      id: "5",
      name: "Roofing Contractor",
      business: "North West Region",
      avatar: "RC",
      rating: 0,
      text: "A roofing company implemented our review automation system to systematically collect customer feedback and build market credibility.",
      results: "Built strong online reputation through consistent review collection and Google Business Profile management"
    },
    {
      id: "6",
      name: "Pest Control Service",
      business: "North East Region",
      avatar: "PC",
      rating: 0,
      text: "A pest control business transformed their local search presence using our methodology to optimize their Google Business Profile and automate customer outreach.",
      results: "Improved from poor search visibility to prominent local search positioning"
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
            <span className="hidden sm:inline">Case Study Scenarios: Our Methodology in Action</span>
            <span className="sm:hidden">Methodology Case Studies</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Example scenarios showing how our 6-phase system helps UK service businesses build stronger online presence and automated review collection.
          </p>
        </div>

        {/* Case Studies Image */}
        <div className="mb-8 md:mb-16">
          <img 
            src={testimonialsImage} 
            alt="Case Study Examples and Business Scenarios"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
          />
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

        {/* Mobile-optimized Case Studies */}
        <MobileTestimonials testimonials={caseStudies} />

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