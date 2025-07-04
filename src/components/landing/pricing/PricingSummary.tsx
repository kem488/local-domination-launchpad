import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Award } from "lucide-react";

export const PricingSummary = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Why Choose Our Services?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div className="text-lg font-semibold text-foreground">Proven Results</div>
              <div className="text-sm text-muted-foreground">200+ UK businesses analyzed</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-lg font-semibold text-foreground">Expert Team</div>
              <div className="text-sm text-muted-foreground">Specialists in local business growth</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-brand-orange" />
              </div>
              <div className="text-lg font-semibold text-foreground">Tailored Solutions</div>
              <div className="text-sm text-muted-foreground">Custom strategies for your trade</div>
            </div>
          </div>

          <div className="p-4 bg-brand-blue-light rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-brand-blue">Our Approach:</strong> We analyze your specific market, competitors, and business goals to create a customized growth strategy that works for your trade.
            </p>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className="btn-hover-effect"
            onClick={() => {
              const scanSection = document.getElementById('business-scan');
              if (scanSection) {
                scanSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get My Free Business Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};