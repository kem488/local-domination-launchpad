
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScanData } from "./BusinessScanSection";
import { ScoreCard } from "./ScoreCard";
import { getScoreBadge, getScoreColor } from "@/utils/scoreCalculations";
import { AlertTriangle, CheckCircle, Star, Users, Camera, FileText, ArrowRight } from "lucide-react";

interface ScanResultsProps {
  scanData: ScanData;
  onViewFullReport: () => void;
  onAiStatusChange?: (status: 'generating' | 'completed' | 'failed') => void;
}

export const ScanResults = ({ scanData, onViewFullReport }: ScanResultsProps) => {
  const { scores, placeDetails, aiRecommendations } = scanData;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <ScoreCard title="Reviews & Rating" score={scores.reviews} icon={Star} />
        <ScoreCard title="Engagement" score={scores.engagement} icon={Users} />
        <ScoreCard title="Photos & Media" score={scores.photos} icon={Camera} />
        <ScoreCard title="Completeness" score={scores.completeness} icon={FileText} />
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
              ⚠️ Your business profile needs attention. Missing optimization opportunities may be costing you potential customers.
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

      {/* AI Recommendations */}
      {aiRecommendations && (
        <Card className="p-6 bg-gradient-to-r from-brand-blue-light to-background border-brand-blue/10">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            AI-Powered Recommendations
          </h4>
          
          {/* Quick Wins */}
          <div className="mb-6">
            <h5 className="font-medium text-foreground mb-3">Quick Wins (Start Here)</h5>
            <div className="space-y-2">
              {aiRecommendations.quickWins.map((win, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Recommendations */}
          <div className="mb-6">
            <h5 className="font-medium text-foreground mb-3">Detailed Action Plan</h5>
            <div className="space-y-4">
              {aiRecommendations.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="border-l-2 border-primary/20 pl-4">
                  <div className="font-medium text-sm text-foreground">{rec.category}</div>
                  <div className="text-sm text-muted-foreground mb-1">{rec.action}</div>
                  <div className="text-xs text-muted-foreground">
                    Impact: {rec.impact} • Timeline: {rec.timeframe}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Impact */}
          <div className="bg-success/10 p-4 rounded-lg">
            <p className="text-sm font-medium text-success mb-1">Potential Revenue Impact</p>
            <p className="text-sm text-muted-foreground">{aiRecommendations.revenueImpact}</p>
          </div>
        </Card>
      )}

      {/* CTA */}
      <div className="text-center space-y-4">
        <h4 className="text-lg sm:text-xl font-semibold text-foreground px-4">
          Want our team to implement these improvements?
        </h4>
        <p className="text-muted-foreground px-4 text-sm sm:text-base">
          Get your detailed report with AI-powered recommendations and actionable insights
        </p>
        <Button
          onClick={onViewFullReport}
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg btn-hover-effect w-full sm:w-auto min-h-[48px] touch-manipulation"
          aria-label="Get detailed profile audit report"
        >
          Get My Free Detailed Report
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
        <div className="text-xs text-muted-foreground px-4">
          100% Free • No Credit Card Required • Instant Access
        </div>
      </div>
    </div>
  );
};
