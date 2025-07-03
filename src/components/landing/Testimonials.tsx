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
      text: "Went from feast-or-famine to consistent £8k months. The automated system brings me customers while I sleep. Never worrying about the next job again.",
      results: "Doubled leads in 30 days, 47 new reviews"
    },
    {
      name: "Sarah Thompson", 
      business: "Thompson's Cleaning Services, Birmingham",
      avatar: "ST",
      rating: 5,
      text: "I was spending 3 hours a week chasing reviews. Now the system does it automatically and my rating went from 3.2 to 4.8 stars. Complete game changer.",
      results: "From 8 to 47 reviews, saved 3 hours weekly"
    },
    {
      name: "David Clarke",
      business: "Clarke's Electrical, Leeds", 
      avatar: "DC",
      rating: 5,
      text: "I used to be invisible on Google. Now I'm the first electrician customers see when they search 'electrician Leeds'. Bookings up 200%.",
      results: "Page 1 rankings, 200% booking increase"
    },
    {
      name: "Emma Williams",
      business: "Williams Garden Design, Bristol",
      avatar: "EW", 
      rating: 5,
      text: "£97 for lifetime access? No-brainer. One landscaping job from the extra leads paid for it 50x over. Now I'm booked solid through winter.",
      results: "Booked solid, £97 ROI in first job"
    },
    {
      name: "James Mitchell",
      business: "Mitchell Roofing, Liverpool",
      avatar: "JM",
      rating: 5,
      text: "My competitors can't figure out how I suddenly got 52 five-star reviews. They're all scrambling to copy me but they're already too far behind.",
      results: "52 new reviews, market dominance"
    },
    {
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
              Join 200+ UK Tradespeople Who've Broken the Feast-or-Famine Cycle
            </p>
            <p className="text-muted-foreground">
              While your competitors struggle with inconsistent leads, you'll have customers finding YOU first.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};