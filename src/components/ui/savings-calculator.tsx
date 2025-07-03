import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp } from "lucide-react";

export const SavingsCalculator = () => {
  const [months, setMonths] = useState([12]);
  
  const lockedRate = 97;
  const regularRate = 247;
  const monthlySavings = regularRate - lockedRate;
  const totalSavings = monthlySavings * months[0];
  const totalCost = lockedRate * months[0];
  const totalRegularCost = regularRate * months[0];

  return (
    <Card className="bg-gradient-to-br from-brand-blue-light to-background border-brand-blue/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
            <Calculator className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <CardTitle className="text-xl text-brand-blue">Savings Calculator</CardTitle>
            <p className="text-sm text-muted-foreground">See how much you'll save with the locked rate</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Time period: {months[0]} months</Label>
          <Slider
            value={months}
            onValueChange={setMonths}
            max={36}
            min={1}
            step={1}
            className="mt-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 month</span>
            <span>3 years</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">Regular price:</span>
            <span className="font-semibold">£{totalRegularCost.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
            <span className="text-sm font-medium">Your cost:</span>
            <span className="font-bold text-success">£{totalCost.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-orange" />
              <span className="font-bold text-brand-orange">Total Savings:</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl text-brand-orange">£{totalSavings.toLocaleString()}</div>
              <Badge className="bg-brand-orange text-brand-orange-foreground">
                {((totalSavings / totalRegularCost) * 100).toFixed(0)}% saved
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-3 bg-brand-blue-light rounded-lg">
          <p className="text-sm text-brand-blue font-medium">
            💡 Your rate stays locked at £97/month forever, even when we increase prices to £300-400+
          </p>
        </div>
      </CardContent>
    </Card>
  );
};