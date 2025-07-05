
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
    <Card className="card-modern p-4 sm:p-6 group hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-semibold text-base sm:text-lg">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <Progress 
          value={score} 
          className="flex-1 h-3" 
          aria-label={`${title} score: ${score} out of 100`} 
        />
        <span className={`font-bold text-xl ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </Card>
  );
};
