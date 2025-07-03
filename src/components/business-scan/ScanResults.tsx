import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScanData } from "./BusinessScanSection";
import { AlertTriangle, CheckCircle, Star, Users, Camera, FileText, ArrowRight } from "lucide-react";

interface ScanResultsProps {
  scanData: ScanData;
  onViewFullReport: () => void;
}

export const ScanResults = ({ scanData, onViewFullReport }: ScanResultsProps) => {
  const { scores, placeDetails } = scanData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const, color: "bg-success" };
    if (score >= 60) return { label: "Good", variant: "secondary" as const, color: "bg-warning" };
    return { label: "Needs Work", variant: "destructive" as const, color: "bg-destructive" };
  };

  const overallBadge = getScoreBadge(scores.overall);

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div className="text-center">
        <div className="mb-4">
          <div className={`text-6xl font-bold ${getScoreColor(scores.overall)} mb-2`}>
            {scores.overall}
          </div>
          <div className="text-2xl font-semibold text-foreground mb-2">
            Overall Business Health Score
          </div>
          <Badge className={`${overallBadge.color} text-white`}>
            {overallBadge.label}
          </Badge>
        </div>

        <div className="max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {placeDetails.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span>{placeDetails.rating}/5</span>
            <span>•</span>
            <span>{placeDetails.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-medium">Reviews & Rating</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={scores.reviews} className="flex-1 h-2" />
            <span className={`font-bold ${getScoreColor(scores.reviews)}`}>
              {scores.reviews}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">Engagement</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={scores.engagement} className="flex-1 h-2" />
            <span className={`font-bold ${getScoreColor(scores.engagement)}`}>
              {scores.engagement}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="h-4 w-4 text-primary" />
            <span className="font-medium">Photos & Media</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={scores.photos} className="flex-1 h-2" />
            <span className={`font-bold ${getScoreColor(scores.photos)}`}>
              {scores.photos}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">Completeness</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={scores.completeness} className="flex-1 h-2" />
            <span className={`font-bold ${getScoreColor(scores.completeness)}`}>
              {scores.completeness}
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="p-6 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          {scores.overall < 70 ? (
            <AlertTriangle className="h-5 w-5 text-warning" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
          Quick Insights
        </h4>
        <div className="space-y-2 text-sm">
          {scores.overall < 70 && (
            <p className="text-muted-foreground">
              ⚠️ Your business profile needs attention. Competitors with better profiles are likely capturing your potential customers.
            </p>
          )}
          {!placeDetails.hasPhotos && (
            <p className="text-muted-foreground">
              📸 Adding photos could increase customer engagement by up to 42%
            </p>
          )}
          {scores.reviews < 70 && (
            <p className="text-muted-foreground">
              ⭐ More reviews are needed to build customer trust and improve local rankings
            </p>
          )}
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h4 className="text-xl font-semibold text-foreground">
          Want to see how to fix these issues?
        </h4>
        <p className="text-muted-foreground">
          Get your detailed report with AI-powered recommendations and action plan
        </p>
        <Button
          onClick={onViewFullReport}
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-8 py-4 text-lg btn-hover-effect"
        >
          Get My Full Report (Free)
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <div className="text-xs text-muted-foreground">
          Includes personalized action plan • Competitor analysis • Revenue impact projections
        </div>
      </div>
    </div>
  );
};