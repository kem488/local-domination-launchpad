
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowRight, RefreshCw, Brain } from "lucide-react";

interface AIRecommendationsProps {
  scanId: string;
  onAiStatusChange?: (status: 'generating' | 'completed' | 'failed') => void;
}

interface Recommendation {
  category: string;
  action: string;
  impact: string;
  timeframe: string;
  difficulty: string;
}

interface RecommendationsData {
  priority: string;
  recommendations: Recommendation[];
  quickWins: string[];
  profileGaps: string;
  revenueImpact: string;
}

export const AIRecommendations = ({ scanId, onAiStatusChange }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRecommendations = async () => {
    if (!scanId) {
      console.error('AIRecommendations: scanId is required');
      setError('Invalid scan ID');
      setLoading(false);
      return;
    }

    try {
      console.log('AIRecommendations: Fetching recommendations for scanId:', scanId);
      const { data, error } = await supabase
        .from('business_scans')
        .select('ai_recommendations')
        .eq('id', scanId)
        .single();

      if (error) throw error;

      if (data?.ai_recommendations) {
        const parsed = typeof data.ai_recommendations === 'string' 
          ? JSON.parse(data.ai_recommendations)
          : data.ai_recommendations;
        setRecommendations(parsed);
        setIsGenerating(false);
        onAiStatusChange?.('completed');
        console.log('AI recommendations loaded successfully');
      } else {
        // No recommendations yet, might still be generating
        if (retryCount < 10) { // Max 10 retries (30 seconds)
          console.log('No AI recommendations found, retrying in 3 seconds...');
          setIsGenerating(true);
          onAiStatusChange?.('generating');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchRecommendations();
          }, 3000);
        } else {
          console.warn('Max retries reached, AI recommendations not available');
          setIsGenerating(false);
          onAiStatusChange?.('failed');
          setError('AI recommendations are taking longer than expected');
        }
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError('Unable to load AI recommendations');
      setIsGenerating(false);
      onAiStatusChange?.('failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [scanId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(0);
    fetchRecommendations();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      default: return 'outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (loading && isGenerating) {
    return (
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-primary">AI Analysis in Progress</h4>
            <p className="text-sm text-muted-foreground">
              Our AI is analyzing your business profile and generating personalized recommendations...
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
        <div className="text-xs text-center text-muted-foreground mt-4">
          This usually takes 10-30 seconds • Powered by AI
        </div>
      </Card>
    );
  }

  if (loading && !isGenerating) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-warning/20 bg-warning/5">
        <div className="flex items-center gap-3 mb-4 text-warning">
          <AlertTriangle className="h-5 w-5" />
          <div className="flex-1">
            <h4 className="font-semibold">AI Analysis Unavailable</h4>
            <p className="text-sm text-muted-foreground">
              {error || "We're still processing your AI recommendations. Basic scan results are available above."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card className="p-6 border-muted bg-muted/5">
        <div className="text-center">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-semibold text-muted-foreground mb-2">No AI Recommendations Available</h4>
          <p className="text-sm text-muted-foreground mb-4">
            AI analysis couldn't be completed for this scan. Basic results are shown above.
          </p>
          <Button variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Priority Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">AI-Powered Recommendations</h3>
          <Badge variant={getPriorityColor(recommendations.priority) as any}>
            {recommendations.priority?.toUpperCase()} Priority
          </Badge>
        </div>
        
        {/* Quick Wins */}
        {recommendations.quickWins && recommendations.quickWins.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Quick Wins (Start Today)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendations.quickWins.map((win, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Impact */}
        {recommendations.revenueImpact && (
          <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-foreground mb-2">Potential Business Impact</h4>
            <p className="text-sm text-muted-foreground">{recommendations.revenueImpact}</p>
          </div>
        )}

        {/* Profile Gaps */}
        {recommendations.profileGaps && (
          <div className="bg-gradient-to-r from-warning/10 to-destructive/10 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Profile Optimization Opportunities
            </h4>
            <p className="text-sm text-muted-foreground">{recommendations.profileGaps}</p>
          </div>
        )}
      </Card>

      {/* Detailed Recommendations */}
      {recommendations.recommendations && recommendations.recommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Detailed Action Plan</h4>
          <div className="grid grid-cols-1 gap-4">
            {recommendations.recommendations.map((rec, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(rec.difficulty)}`}>
                        {rec.difficulty}
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-foreground mb-2">{rec.action}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{rec.impact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Timeframe: {rec.timeframe}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
