import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";

interface ROIInputs {
  currentRating: number;
  monthlyCustomers: number;
  averageJobValue: number;
  reviewsPerMonth: number;
}

interface ROIResults {
  revenueIncrease: number;
  costSavings: number;
  resourceGains: number;
  efficiencyBoost: number;
  visibilityScore: number;
  ratingQuality: number;
  reviewVolume: number;
  platformPresence: number;
  currentLeads: number;
  improvedLeads: number;
  marketReachPotential: number;
}

export const InteractiveROICalculator = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    currentRating: 3.8,
    monthlyCustomers: 4,
    averageJobValue: 3500,
    reviewsPerMonth: 2
  });

  const [results, setResults] = useState<ROIResults>({
    revenueIncrease: 0,
    costSavings: 0,
    resourceGains: 0,
    efficiencyBoost: 0,
    visibilityScore: 0,
    ratingQuality: 0,
    reviewVolume: 0,
    platformPresence: 0,
    currentLeads: 0,
    improvedLeads: 0,
    marketReachPotential: 0
  });

  const businessTypes = ["Carpenter", "Plumber", "Electrician", "Heating Engineer", "Landscaper"];
  const [selectedBusinessType, setSelectedBusinessType] = useState(businessTypes[0]);

  // Calculate ROI metrics
  useEffect(() => {
    const { currentRating, monthlyCustomers, averageJobValue, reviewsPerMonth } = inputs;
    
    // Rating improvement calculations
    const ratingImprovement = Math.min(5, currentRating + 0.7) - currentRating;
    const conversionBoost = ratingImprovement * 0.15; // 15% conversion increase per 0.1 star
    
    // Revenue calculations
    const revenueIncrease = monthlyCustomers * averageJobValue * conversionBoost;
    
    // Cost savings from reduced marketing spend
    const costSavings = revenueIncrease * 0.1; // 10% of revenue increase
    
    // Time savings (automation benefits)
    const resourceGains = 160; // Fixed time savings from automation
    
    // Efficiency from faster responses
    const efficiencyBoost = monthlyCustomers * 35; // £35 per customer from efficiency
    
    // Visibility score calculations
    const ratingQuality = Math.min(100, (currentRating / 5) * 100);
    const reviewVolume = Math.min(100, (reviewsPerMonth / 10) * 100);
    const platformPresence = 25; // Base score before our service
    const visibilityScore = Math.round((ratingQuality + reviewVolume + platformPresence) / 3);
    
    // Lead generation
    const currentLeads = monthlyCustomers;
    const improvedLeads = Math.round(currentLeads * 2.25); // 125% increase
    const marketReachPotential = improvedLeads * averageJobValue;

    setResults({
      revenueIncrease,
      costSavings,
      resourceGains,
      efficiencyBoost,
      visibilityScore,
      ratingQuality,
      reviewVolume,
      platformPresence,
      currentLeads,
      improvedLeads,
      marketReachPotential
    });
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const campaignData = [
    { size: 50, reviews: 12, rating: 0.025 },
    { size: 100, reviews: 25, rating: 0.05 },
    { size: 500, reviews: 125, rating: 0.25 },
    { size: 1000, reviews: 250, rating: 0.5 }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reputation Management ROI Calculator</CardTitle>
        <p className="text-muted-foreground">See your potential business growth</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Business</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="campaigns">Review Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-rating">Current Rating</Label>
                <Input
                  id="current-rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={inputs.currentRating}
                  onChange={(e) => handleInputChange('currentRating', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-customers">Monthly Customers</Label>
                <Input
                  id="monthly-customers"
                  type="number"
                  min="1"
                  value={inputs.monthlyCustomers}
                  onChange={(e) => handleInputChange('monthlyCustomers', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-value">Average Job Value</Label>
                <Input
                  id="job-value"
                  type="number"
                  min="100"
                  value={inputs.averageJobValue}
                  onChange={(e) => handleInputChange('averageJobValue', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviews-month">Reviews per Month</Label>
                <Input
                  id="reviews-month"
                  type="number"
                  min="0"
                  value={inputs.reviewsPerMonth}
                  onChange={(e) => handleInputChange('reviewsPerMonth', parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Visibility Score */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Visibility Score</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${results.visibilityScore * 2.51} 251`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{results.visibilityScore}</span>
                      <span className="text-xs text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span>Rating Quality:</span>
                      <span className="font-semibold">{Math.round(results.ratingQuality)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Review Volume:</span>
                      <span className="font-semibold">{Math.round(results.reviewVolume)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Presence:</span>
                      <span className="font-semibold">{results.platformPresence}/100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            {/* ROI Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-success/10 border-success/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Revenue Increase</div>
                  <div className="text-2xl font-bold text-success">{formatCurrency(results.revenueIncrease)}</div>
                  <div className="text-xs text-success">+0.7 stars improvement</div>
                </CardContent>
              </Card>
              <Card className="bg-brand-blue-light border-brand-blue/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                  <div className="text-2xl font-bold text-brand-blue">{formatCurrency(results.costSavings)}</div>
                  <div className="text-xs text-brand-blue">Marketing reduction</div>
                </CardContent>
              </Card>
              <Card className="bg-warning/10 border-warning/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Resource Gains</div>
                  <div className="text-2xl font-bold text-warning">{formatCurrency(results.resourceGains)}</div>
                  <div className="text-xs text-warning">Time saved</div>
                </CardContent>
              </Card>
              <Card className="bg-brand-orange/10 border-brand-orange/20">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Efficiency Boost</div>
                  <div className="text-2xl font-bold text-brand-orange">{formatCurrency(results.efficiencyBoost)}</div>
                  <div className="text-xs text-brand-orange">Faster responses</div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Expansion */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Expansion Impact</h3>
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Current (1 platform)</div>
                    <div className="text-xl font-bold">{results.currentLeads} leads/month</div>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">With 40+ platforms</div>
                    <div className="text-xl font-bold text-success">{results.improvedLeads} leads/month</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">Expanded Market Reach</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(results.marketReachPotential)}/month potential</div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Expected Results Timeline</span>
                  <span className="text-xl font-bold text-success">4 weeks</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-success h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Review Campaign Projections</h3>
                <div className="grid grid-cols-2 gap-4">
                  {campaignData.map((campaign, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold">{campaign.size} customers</div>
                        <div className="text-sm text-muted-foreground">{campaign.reviews} reviews</div>
                        <div className="text-success font-semibold">+{campaign.rating} stars</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-between">
          <Button 
            className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect"
            onClick={() => {
              // Trigger recalculation animation
              setResults(prev => ({ ...prev }));
            }}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate ROI
          </Button>
          <div className="text-sm text-muted-foreground">
            {selectedBusinessType} Example
          </div>
        </div>
      </CardContent>
    </Card>
  );
};