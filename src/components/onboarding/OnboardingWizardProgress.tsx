import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

interface OnboardingWizardProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
}

export const OnboardingWizardProgress = ({ 
  currentStep, 
  totalSteps, 
  completedSteps = [] 
}: OnboardingWizardProgressProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const steps = [
    { id: 1, title: "Business Basics", description: "Core business information" },
    { id: 2, title: "Location & Contact", description: "Address and contact details" },
    { id: 3, title: "Goals & Marketing", description: "Objectives and current marketing" },
    { id: 4, title: "Google Business", description: "Current Google presence" },
    { id: 5, title: "AI Responses", description: "Review response configuration" },
    { id: 6, title: "Team & Contact", description: "Team members and preferences" },
    { id: 7, title: "Review & Submit", description: "Final review and submission" }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Onboarding Progress</h2>
          <Badge variant="outline">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isPast = step.id < currentStep;
            
            return (
              <div
                key={step.id}
                className={`text-center p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-primary/10 border-2 border-primary'
                    : isPast || isCompleted
                    ? 'bg-success/10 border-2 border-success'
                    : 'bg-muted border-2 border-transparent'
                }`}
              >
                <div className="flex justify-center mb-2">
                  {isPast || isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <Circle className={`h-6 w-6 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div className={`text-xs font-medium ${isCurrent ? 'text-primary' : isPast || isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                  {step.description}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentStep === totalSteps
              ? "Ready to submit your information"
              : `Complete step ${currentStep} to continue`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};