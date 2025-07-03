import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  name: string;
  business: string;
  action: string;
  timeAgo: string;
}

export const LiveNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const mockNotifications: Notification[] = [
    { id: "1", name: "Sarah M.", business: "Manchester Plumbing", action: "just secured their £97 rate", timeAgo: "2 minutes ago" },
    { id: "2", name: "David L.", business: "Leeds Electrical", action: "started their free trial", timeAgo: "5 minutes ago" },
    { id: "3", name: "Emma R.", business: "Bristol Cleaning", action: "locked in their rate", timeAgo: "8 minutes ago" },
    { id: "4", name: "James C.", business: "Liverpool Roofing", action: "joined the system", timeAgo: "12 minutes ago" },
    { id: "5", name: "Lisa W.", business: "Newcastle Landscaping", action: "secured lifetime rate", timeAgo: "15 minutes ago" }
  ];

  useEffect(() => {
    // Show first notification after a delay
    const initialTimer = setTimeout(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      setCurrentNotification({ ...randomNotification, id: Date.now().toString() });
      setIsVisible(true);
    }, 5000);

    // Cycle through notifications every 18 seconds
    const interval = setInterval(() => {
      // Start fade out animation
      setIsAnimating(true);
      
      setTimeout(() => {
        // Show new notification after fade out
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        setCurrentNotification({ ...randomNotification, id: Date.now().toString() });
        setIsAnimating(false);
      }, 300);
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !currentNotification) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card 
        className={`p-4 bg-background/95 backdrop-blur-sm border-l-4 border-l-success shadow-lg transition-all duration-300 ${
          isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-slide-up'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-foreground">{currentNotification.name}</span>
              <Badge variant="secondary" className="text-xs">{currentNotification.business}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{currentNotification.action}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentNotification.timeAgo}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};