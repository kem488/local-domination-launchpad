import { useState, useEffect } from 'react';
import { CheckCircle, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Consultation {
  name: string;
  business: string;
  location: string;
  timeAgo: string;
}

const RECENT_CONSULTATIONS: Consultation[] = [
  {
    name: "Mike",
    business: "Plumbing Services",
    location: "Manchester",
    timeAgo: "2 minutes ago"
  },
  {
    name: "Sarah",
    business: "Electrical Solutions",
    location: "Birmingham",
    timeAgo: "5 minutes ago"
  },
  {
    name: "David",
    business: "Heating & Gas",
    location: "Leeds",
    timeAgo: "8 minutes ago"
  },
  {
    name: "Emma",
    business: "Landscaping Co",
    location: "Liverpool",
    timeAgo: "12 minutes ago"
  },
  {
    name: "James",
    business: "Building Services",
    location: "Bristol",
    timeAgo: "15 minutes ago"
  },
  {
    name: "Kate",
    business: "Roofing Specialists",
    location: "Sheffield",
    timeAgo: "18 minutes ago"
  },
  {
    name: "Tom",
    business: "Kitchen Fitters",
    location: "Newcastle",
    timeAgo: "22 minutes ago"
  },
  {
    name: "Lisa",
    business: "Bathroom Renovations",
    location: "Cardiff",
    timeAgo: "25 minutes ago"
  }
];

export const SocialProofPopups = () => {
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const showRandomConsultation = () => {
      const randomConsultation = RECENT_CONSULTATIONS[Math.floor(Math.random() * RECENT_CONSULTATIONS.length)];
      setCurrentConsultation(randomConsultation);
      setIsVisible(true);

      // Hide after 4 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first popup after 10 seconds
    const initialDelay = setTimeout(() => {
      showRandomConsultation();

      // Then show every 30-45 seconds
      intervalId = setInterval(() => {
        showRandomConsultation();
      }, Math.random() * 15000 + 30000); // 30-45 seconds
    }, 10000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (!currentConsultation || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground text-sm">{currentConsultation.name}</span>
              <Badge variant="secondary" className="text-xs">
                Just Booked
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {currentConsultation.business}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{currentConsultation.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{currentConsultation.timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};