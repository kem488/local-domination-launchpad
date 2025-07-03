import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Search, BarChart3, Brain, FileText } from "lucide-react";

interface ScanProgressProps {
  progress: number;
}

const scanSteps = [
  { icon: Search, label: "Finding your business on Google", threshold: 20 },
  { icon: BarChart3, label: "Analyzing reviews and ratings", threshold: 40 },
  { icon: Brain, label: "Calculating engagement scores", threshold: 60 },
  { icon: FileText, label: "Generating AI recommendations", threshold: 80 },
  { icon: CheckCircle, label: "Compiling your report", threshold: 100 }
];

export const ScanProgress = ({ progress }: ScanProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const step = scanSteps.findIndex(step => progress < step.threshold);
    setCurrentStep(step === -1 ? scanSteps.length - 1 : Math.max(0, step));
  }, [progress]);

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Scanning Your Business Profile...
        </h3>
        <p className="text-muted-foreground">
          We're analyzing your Google Business Profile using live data and AI
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {scanSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = progress >= step.threshold;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-primary/10 border border-primary/20' 
                    : isCompleted 
                    ? 'bg-success/10' 
                    : 'bg-muted/30'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isCurrent 
                    ? 'bg-primary text-primary-foreground animate-pulse' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-sm font-medium ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                {isCompleted && (
                  <CheckCircle className="h-4 w-4 text-success ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground mt-6">
          Analyzing live Google data • This may take up to 30 seconds
        </div>
      </div>
    </div>
  );
};