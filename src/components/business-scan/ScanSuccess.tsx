import { CheckCircle } from "lucide-react";

export const ScanSuccess = () => {
  return (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-foreground mb-4">
        Report Sent Successfully!
      </h3>
      <p className="text-muted-foreground mb-6">
        Check your email for your detailed business analysis and personalized recommendations.
      </p>
    </div>
  );
};