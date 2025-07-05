import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessToastProps {
  title: string;
  message: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const SuccessToast = ({ 
  title, 
  message, 
  onClose, 
  actionLabel, 
  onAction 
}: SuccessToastProps) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg shadow-lg">
      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-success text-sm">
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {message}
        </p>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            size="sm"
            className="mt-3 h-8 px-3 text-xs border-success/30 text-success hover:bg-success/10"
          >
            {actionLabel}
          </Button>
        )}
      </div>
      
      {onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-success/20"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};