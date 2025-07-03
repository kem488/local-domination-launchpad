import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";
import { TrialPopup } from "./TrialPopup";
import { LeadCaptureForm } from "./LeadCaptureForm";

export const CTA = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-brand-blue-light">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="destructive" className="mb-6">
          <Clock className="h-4 w-4 mr-2" />
          Offer Expires July 31st - Only Days Left!
        </Badge>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Stop the Feast-or-Famine Cycle Forever
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join 200+ UK tradespeople who've transformed from "Google Who?" to market leaders. 
          Lock in your £97 lifetime rate before it goes to £247/month on July 31st.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <CheckCircle className="h-6 w-6 text-success" />
            <span className="font-medium">90-Day Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-medium">Proven Results</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg border">
            <Clock className="h-6 w-6 text-warning" />
            <span className="font-medium">Limited Time Only</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <LeadCaptureForm variant="rate-lock">
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-xl btn-hover-effect"
              >
                Lock In £97/Month Before July 31st
              </Button>
            </LeadCaptureForm>
            <TrialPopup>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-xl border-2 btn-hover-effect"
              >
                Start 14-Day Free Trial
              </Button>
            </TrialPopup>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">1. Start Trial</div>
                  <div className="text-muted-foreground">14 days completely free</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">2. Subscribe</div>
                  <div className="text-muted-foreground">£97/month locked rate</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-primary mb-1">3. Results</div>
                  <div className="text-muted-foreground">25+ reviews in 90 days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>✓ No setup fees ✓ 14-day free trial ✓ 90-day money-back guarantee</p>
          <p className="mt-2">Secure SSL encrypted payment processing</p>
        </div>
      </div>
    </section>
  );
};