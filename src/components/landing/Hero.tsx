import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, TrendingUp } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/20">
            Limited Time: Lifetime Access Only £97 (Usually £297/month)
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Get 25+ Google Reviews &amp; 
            <span className="text-primary"> 2x Profile Views</span>
            <br />
            in 90 Days - Guaranteed
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered Local Market Domination System automates review generation and optimizes your Google Business Profile to attract more customers. Built specifically for UK tradespeople and local service businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg"
            >
              Get My Free Business Scan
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Secure My £97 Lifetime Rate
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>No contracts or setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span>4.9/5 average client rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>90-day money-back guarantee</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2">25+</div>
                <div className="text-muted-foreground">New Google Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2">4.5+</div>
                <div className="text-muted-foreground">Star Rating Guarantee</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-2">2x</div>
                <div className="text-muted-foreground">More Profile Views</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};