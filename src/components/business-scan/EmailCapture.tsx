import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, AlertTriangle, TrendingDown, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScanData } from "./BusinessScanSection";

interface EmailCaptureProps {
  scanData: ScanData;
  onFixThisForMe: (email: string) => void;
  onGetFreeReport: (email: string) => void;
}

export const EmailCapture = ({ scanData, onFixThisForMe, onGetFreeReport }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFixThisForMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onFixThisForMe(email.trim());
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetFreeReport = async () => {
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onGetFreeReport(email.trim());
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Needs Work";
    return "Critical Issues";
  };

  const getCriticalIssues = () => {
    const issues = [];
    if (scanData.scores.reviews < 70) {
      issues.push("Low review score affecting customer trust");
    }
    if (scanData.scores.photos < 50) {
      issues.push("Missing visual content to attract customers");
    }
    if (scanData.scores.completeness < 80) {
      issues.push("Incomplete business profile");
    }
    if (scanData.scores.engagement < 60) {
      issues.push("Poor customer engagement signals");
    }
    return issues.slice(0, 3); // Show max 3 issues
  };

  const criticalIssues = getCriticalIssues();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Badge variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Critical Issues Detected
        </Badge>
        
        <h3 className="text-3xl font-bold text-foreground">
          Your Business Health Score
        </h3>
        
        <div className="flex items-center justify-center gap-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {scanData.scores.overall}
          </div>
          <div className="text-left">
            <div className={`text-2xl font-semibold ${getScoreColor(scanData.scores.overall)}`}>
              {getScoreStatus(scanData.scores.overall)}
            </div>
            <div className="text-muted-foreground">
              Out of 100
            </div>
          </div>
        </div>
      </div>

      <Card className="p-6 bg-destructive/5 border-destructive/20">
        <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Critical Issues Found
        </h4>
        <ul className="text-left space-y-3">
          {criticalIssues.map((issue, index) => (
            <li key={index} className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{issue}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-foreground">
                Your competitors are getting ahead
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                While you're missing opportunities, competitors with optimized profiles are attracting your potential customers.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <div className="text-left max-w-md mx-auto">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <form onSubmit={handleFixThisForMe}>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? 'Starting Your Fix...' : 'Fix This For Me'}
            </Button>
          </form>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGetFreeReport}
            disabled={isSubmitting || !email.trim()}
          >
            Get Free Detailed Report
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          We'll send you a detailed analysis and start your 14-day free trial • No credit card required
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {scanData.placeDetails.reviewCount || 0}
          </div>
          <div className="text-xs text-muted-foreground">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1 flex items-center justify-center gap-1">
            {scanData.placeDetails.rating || 0}
            <Star className="h-4 w-4 fill-current" />
          </div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {scanData.scores.completeness}%
          </div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>
    </div>
  );
};