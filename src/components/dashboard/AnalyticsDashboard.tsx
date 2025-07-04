import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Clock, 
  Eye,
  Target,
  BarChart3,
  Activity
} from "lucide-react";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { useABTest } from "@/hooks/useABTesting";

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard = ({ className }: AnalyticsDashboardProps) => {
  const scrollMetrics = useScrollTracking();
  const { attribution, utmParams } = useUTMTracking();
  const conversionTest = useABTest('conversion_optimization');

  // Mock data for demonstration - in production, this would come from your analytics API
  const mockMetrics = {
    totalVisitors: 12547,
    conversionRate: 3.24,
    avgTimeOnPage: 145,
    bounceRate: 42.3,
    leadConversions: 89,
    costPerLead: 47.50,
    lifetimeValue: 2840,
    goalCompletions: {
      trial_signup: 156,
      contact_form: 78,
      phone_calls: 34,
      email_downloads: 203
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <Badge variant="outline" className="text-primary">
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{mockMetrics.totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{mockMetrics.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time on Page</p>
                <p className="text-2xl font-bold">{formatTime(mockMetrics.avgTimeOnPage)}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Per Lead</p>
                <p className="text-2xl font-bold">£{mockMetrics.costPerLead}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-brand-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Session Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Scroll Depth</span>
                <span>{scrollMetrics.scrollDepth}%</span>
              </div>
              <Progress value={scrollMetrics.scrollDepth} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Time on Page</span>
                <span>{formatTime(Math.floor(scrollMetrics.timeOnPage / 1000))}</span>
              </div>
              <Progress value={Math.min((scrollMetrics.timeOnPage / 120000) * 100, 100)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Engagement Score</span>
                <span>{scrollMetrics.engagementScore}/100</span>
              </div>
              <Progress value={scrollMetrics.engagementScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Traffic Attribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attribution && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Source:</span>
                  <Badge variant="secondary">{attribution.source}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Medium:</span>
                  <span className="text-sm">{attribution.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Campaign:</span>
                  <span className="text-sm">{attribution.campaign}</span>
                </div>
                {utmParams.utm_term && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Keyword:</span>
                    <span className="text-sm">{utmParams.utm_term}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Conversion Goals (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(mockMetrics.goalCompletions).map(([goal, count]) => (
              <div key={goal} className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground capitalize">
                  {goal.replace('_', ' ')}
                </p>
                <p className="text-xl font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* A/B Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            A/B Test Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="font-medium">Current Variant</p>
                <p className="text-sm text-muted-foreground">
                  {conversionTest.variant}
                </p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              Track A/B test conversions and performance metrics in real-time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};