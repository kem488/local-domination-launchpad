import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import systemImage from "@/assets/system-overview.png";

export const SystemOverview = () => {
  const systemFeatures = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Automation",
      description: "Enterprise-grade review automation technology that works 24/7"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Proven Methodology",
      description: "6-phase system based on 200+ UK business analysis and market research"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Quantifiable Results",
      description: "Specific metrics: 25+ reviews, 4.5+ stars, 2x profile views in 90 days"
    }
  ];

  const industryStats = [
    { stat: "90%", label: "of customers read reviews before purchase" },
    { stat: "82%", label: "of SMBs struggle with consistent lead generation" },
    { stat: "73%", label: "of consumers trust businesses with 4+ star ratings" },
    { stat: "68%", label: "check Google Business Profile before visiting" }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-brand-blue-light text-brand-blue border-brand-blue/20">
            Enterprise-Level Technology for Local Businesses
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built on Proven Data & Industry Research
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our system combines cutting-edge AI technology with deep understanding of UK local service markets, backed by extensive research and industry best practices.
          </p>
        </div>

        {/* System Overview Image */}
        <div className="mb-16">
          <img 
            src={systemImage} 
            alt="System Overview Dashboard"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* System Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {systemFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Statistics */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Industry Research & Market Data</CardTitle>
            <p className="text-muted-foreground">
              Our system is built on comprehensive analysis of UK local service markets
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {industryStats.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk-Free Guarantee */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
              <h3 className="text-2xl font-bold text-foreground">90-Day Results Guarantee</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
              We're so confident in our system that we guarantee specific results within 90 days. 
              If you don't achieve 25+ reviews and 4.5+ stars, we'll work for free until you do.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>25+ new reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>4.5+ star average</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>2x profile views</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>50+ directory listings</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};