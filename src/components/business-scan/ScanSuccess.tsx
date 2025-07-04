import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Mail, Sparkles } from "lucide-react";

export const ScanSuccess = () => {
  return (
    <div className="text-center space-y-8 py-8">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <CheckCircle className="h-16 w-16 text-success" />
          <Sparkles className="h-6 w-6 text-brand-orange absolute -top-1 -right-1" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-foreground">
          🎉 Success! Your Report is Ready
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Check your email for your detailed business analysis report with AI-powered recommendations 
          to help improve your online presence and attract more customers.
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-r from-success/10 to-primary/10 border-success/20 max-w-2xl mx-auto">
        <h4 className="text-xl font-semibold text-foreground mb-4">
          What's Next?
        </h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">Check Your Email</p>
              <p className="text-sm text-muted-foreground">Your detailed report is waiting in your inbox (check spam/junk folder too)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-white font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Review Your Action Plan</p>
              <p className="text-sm text-muted-foreground">See exactly what needs to be improved and how it impacts your revenue potential</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-white font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Speak with Our Team</p>
              <p className="text-sm text-muted-foreground">We'll follow up to discuss how we can help implement these improvements</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Button
          onClick={() => {
            // Scroll to pricing section to learn more
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
        >
          Learn About Our Services
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Get personalized recommendations and see how we can help grow your business
        </p>
      </div>

      <div className="pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Questions? Contact our team at support@syngularitylabs.com
        </p>
      </div>
    </div>
  );
};