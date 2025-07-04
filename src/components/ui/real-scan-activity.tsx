import { useState, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ScanActivity {
  id: string;
  business_name: string;
  business_location: string;
  created_at: string;
  timeAgo: string;
}

export const RealScanActivity = () => {
  const [currentScan, setCurrentScan] = useState<ScanActivity | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const formatTimeAgo = (createdAt: string) => {
    const now = new Date();
    const scanTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - scanTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const fetchRecentScans = async () => {
    try {
      const { data, error } = await supabase
        .from('business_scans')
        .select('id, business_name, business_location, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching scans:', error);
        return [];
      }

      return data?.map(scan => ({
        ...scan,
        timeAgo: formatTimeAgo(scan.created_at)
      })) || [];
    } catch (error) {
      console.error('Error in fetchRecentScans:', error);
      return [];
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const showRandomScan = async () => {
      const recentScans = await fetchRecentScans();
      if (recentScans.length === 0) return;

      const randomScan = recentScans[Math.floor(Math.random() * Math.min(recentScans.length, 10))];
      
      // Start fade out animation if already visible
      if (isVisible) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentScan(randomScan);
          setIsAnimating(false);
        }, 300);
      } else {
        setCurrentScan(randomScan);
        setIsVisible(true);
      }

      // Hide after 4 seconds
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first popup after 8 seconds
    const initialDelay = setTimeout(() => {
      showRandomScan();

      // Then show every 25-35 seconds
      intervalId = setInterval(() => {
        showRandomScan();
      }, Math.random() * 10000 + 25000);
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isVisible]);

  if (!currentScan || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card 
        className={`p-4 bg-background/95 backdrop-blur-sm border-l-4 border-l-primary shadow-lg transition-all duration-300 ${
          isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-slide-up'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-foreground">
                {currentScan.business_name}
              </span>
              <Badge variant="secondary" className="text-xs">
                Scanned
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Business analysis completed
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{currentScan.business_location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{currentScan.timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};