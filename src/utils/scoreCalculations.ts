
export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

export const getScoreBadge = (score: number) => {
  if (score >= 80) return { label: "Excellent", variant: "default" as const, color: "bg-success" };
  if (score >= 60) return { label: "Good", variant: "secondary" as const, color: "bg-warning" };
  return { label: "Needs Work", variant: "destructive" as const, color: "bg-destructive" };
};

export const getScoreIcon = (score: number) => {
  if (score >= 80) return "CheckCircle";
  if (score >= 60) return "AlertTriangle";
  return "AlertTriangle";
};

export const getScoreDescription = (score: number): string => {
  if (score >= 80) return "Your profile is performing well in this area";
  if (score >= 60) return "There's room for improvement in this area";
  return "This area needs immediate attention";
};
