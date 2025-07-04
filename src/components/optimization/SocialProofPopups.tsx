import { useState, useEffect } from 'react';
import { CheckCircle, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SignUp {
  name: string;
  business: string;
  location: string;
  timeAgo: string;
}

const RECENT_SIGNUPS: SignUp[] = [
  { name: "Mike", business: "Plumbing Services", location: "Manchester", timeAgo: "2 minutes ago" },
  { name: "Sarah", business: "Electrical Solutions", location: "Birmingham", timeAgo: "5 minutes ago" },
  { name: "David", business: "Heating & Gas", location: "Leeds", timeAgo: "8 minutes ago" },
  { name: "Emma", business: "Landscaping Co", location: "Liverpool", timeAgo: "12 minutes ago" },
  { name: "James", business: "Building Services", location: "Bristol", timeAgo: "15 minutes ago" },
  { name: "Kate", business: "Roofing Specialists", location: "Sheffield", timeAgo: "18 minutes ago" },
  { name: "Tom", business: "Kitchen Fitters", location: "Newcastle", timeAgo: "22 minutes ago" },
  { name: "Lisa", business: "Bathroom Renovations", location: "Cardiff", timeAgo: "25 minutes ago" }
];

export const SocialProofPopups = () => {
  const [currentSignUp, setCurrentSignUp] = useState<SignUp | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const showRandomSignUp = () => {
      const randomSignUp = RECENT_SIGNUPS[Math.floor(Math.random() * RECENT_SIGNUPS.length)];
      setCurrentSignUp(randomSignUp);
      setIsVisible(true);

      // Hide after 4 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first popup after 10 seconds
    const initialDelay = setTimeout(() => {
      showRandomSignUp();
      
      // Then show every 30-45 seconds
      intervalId = setInterval(() => {
        showRandomSignUp();
      }, Math.random() * 15000 + 30000); // 30-45 seconds
    }, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (!currentSignUp || !isVisible) return null;

  return (
    <Card className={`fixed bottom-20 left-4 z-40 p-3 max-w-sm bg-background/95 backdrop-blur-md border border-brand-orange/20 shadow-lg transition-all duration-500 ${
      isVisible ? 'animate-slide-in-left opacity-100' : 'animate-slide-out-left opacity-0'
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="h-4 w-4 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold">{currentSignUp.name}</span> just secured the £97 rate!
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {currentSignUp.business}
            </Badge>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{currentSignUp.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{currentSignUp.timeAgo}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};