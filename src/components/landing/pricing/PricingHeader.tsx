import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export const PricingHeader = () => {
  return (
    <div className="text-center mb-12">
      <Badge variant="destructive" className="mb-4 animate-pulse">
        <Clock className="h-4 w-4 mr-2" />
        Only 7 Spots Left - Ends July 31st
      </Badge>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
        Start Free Trial & Lock £97/Month Rate For Life
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Try our system free for 14 days, then pay just £97/month locked forever. No risk, all reward - and you'll save £1,800/year vs our regular £247/month price.
      </p>
    </div>
  );
};