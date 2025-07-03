import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Mark Richardson",
      business: "Richardson Plumbing, Manchester",
      avatar: "MR",
      rating: 5,
      text: "Went from 3 reviews to 47 reviews in 2 months. My phone hasn't stopped ringing since. Best investment I've made for my business.",
      results: "47 new reviews, 340% increase in calls"
    },
    {
      name: "Sarah Thompson", 
      business: "Thompson's Cleaning Services, Birmingham",
      avatar: "ST",
      rating: 5,
      text: "The automated system is brilliant. My customers actually leave reviews now without me having to chase them. Game changer!",
      results: "31 new reviews, 4.8-star average rating"
    },
    {
      name: "David Clarke",
      business: "Clarke's Electrical, Leeds", 
      avatar: "DC",
      rating: 5,
      text: "I was skeptical at first, but the results speak for themselves. My Google profile shows up first for 'electrician Leeds' now.",
      results: "Top 3 ranking for main keywords"
    },
    {
      name: "Emma Williams",
      business: "Williams Garden Design, Bristol",
      avatar: "EW", 
      rating: 5,
      text: "The lifetime deal was a no-brainer. In just one project, the increased bookings already paid for itself multiple times over.",
      results: "65% increase in monthly bookings"
    },
    {
      name: "James Mitchell",
      business: "Mitchell Roofing, Liverpool",
      avatar: "JM",
      rating: 5,
      text: "Finally, a system that actually works. My competitors are all asking how I got so many 5-star reviews so quickly.",
      results: "52 new reviews, doubled enquiries"
    },
    {
      name: "Lisa Roberts",
      business: "Roberts Pest Control, Newcastle", 
      avatar: "LR",
      rating: 5,
      text: "The team at SyngularityLabs really knows what they're doing. Professional service and incredible results.",
      results: "From invisible to market leader in 90 days"
    }
  ];

  const stats = [
    { number: "3,000+", label: "Businesses Transformed" },
    { number: "50,000+", label: "Reviews Generated" }, 
    { number: "4.9/5", label: "Average Client Rating" },
    { number: "90%", label: "See Results in 30 Days" }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Real Results from Real UK Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how local service businesses across the UK have transformed their online presence and grown their customer base.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                
                <Badge variant="secondary" className="mb-4 bg-success/10 text-success border-success/20">
                  {testimonial.results}
                </Badge>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Join 3,000+ UK Businesses Already Dominating Their Local Markets
            </p>
            <p className="text-muted-foreground">
              Your competitors are getting stronger every day. Don't get left behind.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};