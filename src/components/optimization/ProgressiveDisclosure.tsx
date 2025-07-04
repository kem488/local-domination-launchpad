import { useState } from 'react';
import { Calculator, TrendingUp, Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackEngagement } from '@/hooks/useABTesting';

interface ProgressiveDisclosureProps {
  className?: string;
}

export const ProgressiveDisclosure = ({ className = '' }: ProgressiveDisclosureProps) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [monthlyLeads, setMonthlyLeads] = useState(10);
  const [avgJobValue, setAvgJobValue] = useState(500);

  const handleShowCalculator = () => {
    setShowCalculator(true);
    trackEngagement('show_calculator', 'pricing_section');
  };

  const currentMonthlyRevenue = monthlyLeads * avgJobValue;
  const improvedMonthlyRevenue = (monthlyLeads * 2.5) * avgJobValue; // 2.5x improvement
  const additionalRevenue = improvedMonthlyRevenue - currentMonthlyRevenue;
  const annualSavings = additionalRevenue * 12;
  const roiMultiplier = Math.round(additionalRevenue / 97);

  return (
    <div className={className}>
      {!showCalculator ? (
        <Card className="border-brand-orange/20 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 hover:from-brand-orange/10 hover:to-brand-blue/10 transition-all duration-300 cursor-pointer" onClick={handleShowCalculator}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-brand-orange" />
              <span className="font-semibold">See Your ROI Potential</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Calculate how much additional revenue our system could generate for your business
            </p>
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Calculate My Savings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-brand-orange/20 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Your ROI Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Based on average client results from our Local Market Domination System
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current monthly leads:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-medium">{monthlyLeads} leads/month</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Average job value:</label>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="50"
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-medium">£{avgJobValue.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Current Revenue</div>
                  <div className="font-bold">£{currentMonthlyRevenue.toLocaleString()}/month</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="text-sm text-success">With Our System</div>
                  <div className="font-bold text-success">£{improvedMonthlyRevenue.toLocaleString()}/month</div>
                </div>
              </div>

              <Card className="bg-brand-orange/10 border-brand-orange/20">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-brand-orange" />
                    <span className="font-semibold">Additional Monthly Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-brand-orange">
                    +£{additionalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Annual impact: £{annualSavings.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Badge variant="outline" className="justify-center p-2">
                  <Clock className="h-4 w-4 mr-1" />
                  ROI: {roiMultiplier}x monthly
                </Badge>
                <Badge variant="outline" className="justify-center p-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Payback: 3 days
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground text-center mt-3">
                *Based on average 2.5x lead increase from our 200+ UK clients
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};