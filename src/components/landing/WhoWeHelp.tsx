import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Star, Target } from "lucide-react";

export const WhoWeHelp = () => {
  const serviceBlocks = [
    {
      icon: Search,
      title: "Competitor Vulnerability Report",
      description: "We'll show you exactly where your competitors are weak and how to exploit those gaps to steal their customers."
    },
    {
      icon: TrendingUp,
      title: "Local Search Domination Plan", 
      description: "Discover the hidden ranking factors your competitors use to appear first on Google Maps and local search."
    },
    {
      icon: Star,
      title: "Review Generation System",
      description: "The exact process top-ranking businesses use to generate 25+ genuine reviews monthly without chasing customers."
    },
    {
      icon: Target,
      title: "Customer Leak Detection",
      description: "Find out where you're losing potential customers and how to plug those leaks before they call your competitors."
    }
  ];

  const stats = [
    { number: "500+", label: "Local Businesses Analyzed" },
    { number: "89%", label: "Miss This Critical Ranking Factor" },
    { number: "30 Seconds", label: "Average Analysis Time" },
    { number: "100%", label: "Free Forever" }
  ];

  return (
    <section id="who-we-help" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for UK Tradespeople Who Want to Dominate Local Search
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop wondering why your competitors always appear first on Google. 
            Our comprehensive analysis reveals their exact strategy and shows you 
            how to beat them at their own game.
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
              Your competitors are getting stronger every day you wait
            </p>
            <p className="text-base text-muted-foreground">
              Every call they get should have been yours
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};