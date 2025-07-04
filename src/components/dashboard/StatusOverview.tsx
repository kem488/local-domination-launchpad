import { Card, CardContent } from "@/components/ui/card";
import { User, Building, Settings } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { BusinessRecord } from "@/types/business";

interface StatusOverviewProps {
  business: BusinessRecord;
  progress: number;
}

export const StatusOverview = ({ business, progress }: StatusOverviewProps) => {
  const gbpRequest = business.gbp_access_requests?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Profile Completion</span>
          </div>
          <div className="text-2xl font-bold">{progress}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">GBP Status</span>
          </div>
          <div className="mt-1">
            <StatusBadge status={gbpRequest?.status || 'pending'} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Setup Status</span>
          </div>
          <div className="text-lg font-semibold">
            {business.wizard_completed ? 'Complete' : 'In Progress'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};