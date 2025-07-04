import { useEffect, useState, useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ScrollMetrics {
  maxScroll: number;
  timeOnPage: number;
  scrollDepth: number;
  engagementScore: number;
}

export const useScrollTracking = () => {
  const { trackEvent } = useAnalytics();
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    maxScroll: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    engagementScore: 0
  });

  const [startTime] = useState(Date.now());
  const [scrollMilestones] = useState([25, 50, 75, 90, 100]);
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(new Set());

  const calculateScrollDepth = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }, []);

  const calculateEngagementScore = useCallback((scrollDepth: number, timeOnPage: number) => {
    const scrollScore = Math.min(scrollDepth / 100, 1);
    const timeScore = Math.min(timeOnPage / 60000, 1); // Cap at 1 minute
    return Math.round((scrollScore * 0.6 + timeScore * 0.4) * 100);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScroll = calculateScrollDepth();
    const timeOnPage = Date.now() - startTime;

    setMetrics(prev => {
      const newMaxScroll = Math.max(prev.maxScroll, currentScroll);
      const engagementScore = calculateEngagementScore(newMaxScroll, timeOnPage);

      return {
        maxScroll: newMaxScroll,
        timeOnPage,
        scrollDepth: currentScroll,
        engagementScore
      };
    });

    // Track scroll milestones
    scrollMilestones.forEach(milestone => {
      if (currentScroll >= milestone && !trackedMilestones.has(milestone)) {
        setTrackedMilestones(prev => new Set([...prev, milestone]));
        
        trackEvent({
          action: 'scroll_depth',
          category: 'engagement',
          label: `${milestone}%`,
          value: milestone,
          custom_parameters: {
            scroll_depth: milestone,
            time_to_depth: Date.now() - startTime,
            page_url: window.location.pathname
          }
        });
      }
    });
  }, [calculateScrollDepth, startTime, scrollMilestones, trackedMilestones, trackEvent, calculateEngagementScore]);

  // Track time-based milestones
  useEffect(() => {
    const timeMilestones = [10000, 30000, 60000, 120000]; // 10s, 30s, 1m, 2m
    const trackedTimes = new Set<number>();

    const interval = setInterval(() => {
      const timeOnPage = Date.now() - startTime;
      
      timeMilestones.forEach(milestone => {
        if (timeOnPage >= milestone && !trackedTimes.has(milestone)) {
          trackedTimes.add(milestone);
          
          trackEvent({
            action: 'time_on_page',
            category: 'engagement',
            label: `${milestone / 1000}s`,
            value: milestone,
            custom_parameters: {
              time_milestone: milestone,
              scroll_depth: metrics.scrollDepth,
              engagement_score: metrics.engagementScore
            }
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, trackEvent, metrics.scrollDepth, metrics.engagementScore]);

  // Track page exit with final metrics
  useEffect(() => {
    const handleBeforeUnload = () => {
      const finalTimeOnPage = Date.now() - startTime;
      
      trackEvent({
        action: 'page_exit',
        category: 'engagement',
        label: 'session_end',
        value: finalTimeOnPage,
        custom_parameters: {
          total_time_on_page: finalTimeOnPage,
          max_scroll_depth: metrics.maxScroll,
          final_engagement_score: calculateEngagementScore(metrics.maxScroll, finalTimeOnPage)
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime, metrics.maxScroll, trackEvent, calculateEngagementScore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return metrics;
};