import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

export const ScanHeader = () => {
  return (
    <div className="text-center mb-12">
      <Badge variant="secondary" className="mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/20">
        Free Google Business Profile Audit Tool
      </Badge>
      
      <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
        Get Your Free
        <span className="text-primary block">Google Business Profile Health Check</span>
      </h2>
      
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Our veteran-developed AI analyzes your Google Business Profile and reveals exactly what's holding your business back from getting more calls. You'll get specific improvement recommendations and a step-by-step optimization plan.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground mb-8">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <span>100% Free, No Credit Card Required</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>AI-Powered Recommendations</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Instant Improvement Plan in 30 Seconds</span>
        </div>
      </div>
    </div>
  );
};