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
    <div className="text-center py-8 px-4">
      <div className="mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Scanning Your Business Profile...
        </h3>
        <p className="text-muted-foreground text-base sm:text-lg">
          We're analyzing your Google Business Profile using live data and AI
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progress} className="h-4" />
          <div className="text-sm text-muted-foreground font-medium">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {scanSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = progress >= step.threshold;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-soft transform scale-105' 
                    : isCompleted 
                    ? 'bg-gradient-to-r from-success/10 to-success/5 border border-success/20' 
                    : 'bg-gradient-card border border-border/30'
                }`}
              >
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-gradient-success text-white shadow-medium' 
                    : isCurrent 
                    ? 'bg-gradient-primary text-primary-foreground animate-pulse shadow-glow' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-sm font-medium flex-1 text-left ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 animate-scale-in" />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground mt-8 p-4 bg-gradient-card rounded-lg border border-border/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="font-medium">Analyzing live Google data</span>
          </div>
          <p>This may take up to 30 seconds for comprehensive analysis</p>
        </div>
      </div>
    </div>
  );
};