import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Star, Target } from "lucide-react";

export const WhoWeHelp = () => {
  const serviceBlocks = [
    {
      icon: Search,
      title: "Profile Optimization Report",
      description: "Our AI identifies exactly what's missing from your Google Business Profile and provides specific recommendations to improve your local search visibility."
    },
    {
      icon: TrendingUp,
      title: "Local Search Improvement Plan", 
      description: "Discover the ranking factors you're missing and get a step-by-step plan to optimize your profile for better Google Maps visibility."
    },
    {
      icon: Star,
      title: "Review Strategy Blueprint",
      description: "Learn why customers aren't leaving reviews and get proven tactics to generate 25+ genuine reviews monthly."
    },
    {
      icon: Target,
      title: "Customer Conversion Analysis",
      description: "Find out where you're losing potential customers in your profile and how to optimize for more phone calls and visits."
    }
  ];

  const stats = [
    { number: "90%", label: "of customers check Google Business Profiles before visiting" },
    { number: "89%", label: "of businesses have incomplete or poorly optimized profiles" },
    { number: "73%", label: "won't call businesses with poor online presence" },
    { number: "68%", label: "choose businesses based on Google Business Profile quality" }
  ];

  return (
    <section id="who-we-help" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our AI Profile Audit Reveals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our artificial intelligence system analyzes your Google Business Profile using the same factors Google uses to rank local businesses. Get actionable recommendations you can implement immediately.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Service Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceBlocks.map((block, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <block.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{block.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{block.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-destructive/10 to-primary/10 border-destructive/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Every day your Google Business Profile isn't optimized is another day you're losing customers
            </p>
            <p className="text-base text-muted-foreground">
              The longer you wait, the further behind you fall in local search results
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};