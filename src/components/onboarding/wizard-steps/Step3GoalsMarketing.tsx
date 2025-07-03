import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Step3GoalsMarketingProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step3GoalsMarketing = ({ data, onDataChange, onNext, onPrevious }: Step3GoalsMarketingProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.primary_goals || []);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>(data.pain_points || []);
  const [selectedMarketingMethods, setSelectedMarketingMethods] = useState<string[]>(data.current_marketing_methods || []);

  const goals = [
    "Increase online visibility",
    "Get more customer reviews",
    "Improve Google ranking",
    "Generate more leads",
    "Build brand awareness",
    "Expand to new areas",
    "Automate marketing tasks",
    "Better compete with competitors"
  ];

  const painPoints = [
    "Not enough online reviews",
    "Poor Google Business Profile",
    "Inconsistent lead flow",
    "Too much time on marketing",
    "Negative reviews affecting business",
    "Competitors ranking higher",
    "No online presence strategy",
    "Manual marketing processes"
  ];

  const marketingMethods = [
    "Google Ads",
    "Facebook/Social Media Ads",
    "Local directories",
    "Word of mouth",
    "Flyers/Print advertising",
    "Networking events",
    "Previous agency",
    "None/Very little"
  ];

  const toggleGoal = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(updated);
    onDataChange({ ...data, primary_goals: updated });
  };

  const togglePainPoint = (point: string) => {
    const updated = selectedPainPoints.includes(point)
      ? selectedPainPoints.filter(p => p !== point)
      : [...selectedPainPoints, point];
    setSelectedPainPoints(updated);
    onDataChange({ ...data, pain_points: updated });
  };

  const toggleMarketingMethod = (method: string) => {
    const updated = selectedMarketingMethods.includes(method)
      ? selectedMarketingMethods.filter(m => m !== method)
      : [...selectedMarketingMethods, method];
    setSelectedMarketingMethods(updated);
    onDataChange({ ...data, current_marketing_methods: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Goals & Current Marketing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">What are your primary goals? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {goals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={selectedGoals.includes(goal)}
                  onCheckedChange={() => toggleGoal(goal)}
                />
                <Label htmlFor={goal} className="text-sm">{goal}</Label>
              </div>
            ))}
          </div>
          {selectedGoals.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedGoals.map((goal) => (
                <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                  {goal}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleGoal(goal)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-base font-medium">What are your biggest challenges? (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {painPoints.map((point) => (
              <div key={point} className="flex items-center space-x-2">
                <Checkbox
                  id={point}
                  checked={selectedPainPoints.includes(point)}
                  onCheckedChange={() => togglePainPoint(point)}
                />
                <Label htmlFor={point} className="text-sm">{point}</Label>
              </div>
            ))}
          </div>
          {selectedPainPoints.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedPainPoints.map((point) => (
                <Badge key={point} variant="destructive" className="flex items-center gap-1">
                  {point}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => togglePainPoint(point)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-base font-medium">Current marketing methods (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {marketingMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={method}
                  checked={selectedMarketingMethods.includes(method)}
                  onCheckedChange={() => toggleMarketingMethod(method)}
                />
                <Label htmlFor={method} className="text-sm">{method}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">What's your monthly marketing budget range?</Label>
          <RadioGroup
            value={data.marketing_budget_range || ""}
            onValueChange={(value) => onDataChange({ ...data, marketing_budget_range: value })}
            className="mt-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under-500" id="under-500" />
              <Label htmlFor="under-500">Under £500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500-1000" id="500-1000" />
              <Label htmlFor="500-1000">£500 - £1,000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000-2500" id="1000-2500" />
              <Label htmlFor="1000-2500">£1,000 - £2,500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2500-5000" id="2500-5000" />
              <Label htmlFor="2500-5000">£2,500 - £5,000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="over-5000" id="over-5000" />
              <Label htmlFor="over-5000">Over £5,000</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedGoals.length === 0 || selectedPainPoints.length === 0}
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};