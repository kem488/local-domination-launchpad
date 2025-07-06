import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import systemImage from "@/assets/system-overview.png";

export const SystemOverview = () => {
  const systemFeatures = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Profile Completeness Score",
      description: "Measures how complete your profile is vs Google's requirements"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Local SEO Assessment",
      description: "Analyzes your profile against Google's ranking factors"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Review Generation Analysis",
      description: "Identifies why customers aren't leaving reviews"
    }
  ];

  const industryStats = [
    { stat: "90%", label: "of customers read reviews before purchase" },
    { stat: "82%", label: "of SMBs struggle with consistent lead generation" },
    { stat: "73%", label: "of consumers trust businesses with 4+ star ratings" },
    { stat: "68%", label: "check Google Business Profile before visiting" }
  ];

  return (
    <section className="mobile-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <Badge variant="premium" className="mb-4 lg:mb-6 text-sm font-semibold shadow-soft">
            AI-Powered Profile Analysis Built by Marketing Veterans
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
            Built on Proven Data & Industry Research
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our artificial intelligence system analyzes your Google Business Profile using the same factors Google uses to rank local businesses. Developed by local marketing veterans with actionable recommendations.
          </p>
        </div>

        {/* Enhanced System Overview Image */}
        <div className="mb-16 lg:mb-20">
          <div className="relative">
            <img 
              src={systemImage} 
              alt="System Overview Dashboard"
              className="w-full max-w-5xl mx-auto rounded-2xl shadow-strong hover:shadow-glow transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Enhanced System Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {systemFeatures.map((feature, index) => (
            <Card key={index} className="text-center card-modern group hover:scale-105 transition-all duration-500">
              <CardHeader className="pb-4">
                <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4 lg:mb-6 shadow-glow group-hover:shadow-strong transition-all duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Industry Statistics */}
        <Card className="mb-12 lg:mb-16 card-modern">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">Industry Research & Market Data</CardTitle>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our system is built on comprehensive analysis of UK local service markets
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {industryStats.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300">{item.stat}</div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-tight">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Risk-Free Guarantee */}
        <div className="text-center">
          <Card className="inline-block p-6 lg:p-10 bg-gradient-to-r from-success/10 via-primary/10 to-success/10 border-success/20 shadow-medium hover:shadow-strong transition-all duration-300 max-w-4xl">
            <div className="flex items-center justify-center gap-3 lg:gap-4 mb-4 lg:mb-6">
              <CheckCircle className="h-8 w-8 lg:h-10 lg:w-10 text-success" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">90-Day Results Guarantee</h3>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8 leading-relaxed">
              Guaranteed results within 90 days: 25+ reviews, 4.5+ stars, 2x profile views, and complete profile optimization.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              <div className="flex items-center justify-center gap-2 p-3 bg-success/5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium">25+ new reviews</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-success/5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium">4.5+ star average</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-success/5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium">2x profile views</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-success/5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm font-medium">50+ directory listings</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};