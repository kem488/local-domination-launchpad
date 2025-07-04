import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'granted':
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Access Granted
        </Badge>
      );
    case 'denied':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Access Denied
        </Badge>
      );
    case 'sent':
      return (
        <Badge variant="secondary">
          <Mail className="h-3 w-3 mr-1" />
          Request Sent
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};