import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Star, Target } from "lucide-react";

export const WhoWeHelp = () => {
  const serviceBlocks = [
    {
      icon: Search,
      title: "Profile Optimization Report",
      description: "AI identifies what's missing from your Google Business Profile and provides specific recommendations to improve local search visibility."
    },
    {
      icon: TrendingUp,
      title: "Local Search Improvement Plan", 
      description: "Discover missing ranking factors and get a step-by-step plan to optimize your profile for better Google Maps visibility."
    },
    {
      icon: Star,
      title: "Review Strategy Blueprint",
      description: "Learn why customers aren't leaving reviews and get proven tactics to generate 25+ genuine reviews monthly."
    },
    {
      icon: Target,
      title: "Customer Conversion Analysis",
      description: "Find where you're losing potential customers and how to optimize for more phone calls and visits."
    }
  ];

  const stats = [
    { number: "90%", label: "of customers check Google Business Profiles before visiting" },
    { number: "89%", label: "of businesses have incomplete or poorly optimized profiles" },
    { number: "73%", label: "won't call businesses with poor online presence" },
    { number: "68%", label: "choose businesses based on Google Business Profile quality" }
  ];

  return (
    <section id="who-we-help" className="mobile-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
            What Our AI Profile Audit Reveals
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our artificial intelligence system analyzes your Google Business Profile using the same factors Google uses to rank local businesses. Get actionable recommendations you can implement immediately.
          </p>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center card-glass rounded-xl p-4 lg:p-6 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300">{stat.number}</div>
              <div className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Service Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {serviceBlocks.map((block, index) => (
            <Card key={index} className="card-modern group hover:scale-105 transition-all duration-500">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-strong transition-all duration-300">
                    <block.icon className="h-6 w-6 lg:h-7 lg:w-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-primary transition-colors duration-300">{block.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{block.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block p-6 lg:p-8 bg-gradient-to-r from-destructive/10 via-primary/10 to-brand-orange/10 border-destructive/20 shadow-medium hover:shadow-strong transition-all duration-300 max-w-4xl">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 lg:mb-4">
              Every day your Google Business Profile isn't optimized is another day you're losing customers
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              The longer you wait, the further behind you fall in local search results
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};