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
const RECENT_SIGNUPS: SignUp[] = [{
  name: "Mike",
  business: "Plumbing Services",
  location: "Manchester",
  timeAgo: "2 minutes ago"
}, {
  name: "Sarah",
  business: "Electrical Solutions",
  location: "Birmingham",
  timeAgo: "5 minutes ago"
}, {
  name: "David",
  business: "Heating & Gas",
  location: "Leeds",
  timeAgo: "8 minutes ago"
}, {
  name: "Emma",
  business: "Landscaping Co",
  location: "Liverpool",
  timeAgo: "12 minutes ago"
}, {
  name: "James",
  business: "Building Services",
  location: "Bristol",
  timeAgo: "15 minutes ago"
}, {
  name: "Kate",
  business: "Roofing Specialists",
  location: "Sheffield",
  timeAgo: "18 minutes ago"
}, {
  name: "Tom",
  business: "Kitchen Fitters",
  location: "Newcastle",
  timeAgo: "22 minutes ago"
}, {
  name: "Lisa",
  business: "Bathroom Renovations",
  location: "Cardiff",
  timeAgo: "25 minutes ago"
}];
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
  return;
};