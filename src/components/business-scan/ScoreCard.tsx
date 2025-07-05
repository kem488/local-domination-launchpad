
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreColor } from "@/utils/scoreCalculations";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  className?: string;
}

export const ScoreCard = ({ title, score, icon: Icon, className }: ScoreCardProps) => {
  return (
    <Card className={`p-3 sm:p-4 ${className || ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="font-medium text-sm sm:text-base">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <Progress 
          value={score} 
          className="flex-1 h-2" 
          aria-label={`${title} score: ${score} out of 100`} 
        />
        <span className={`font-bold text-sm sm:text-base ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </Card>
  );
};
