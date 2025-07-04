import { useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useConversionTracking = () => {
  const { trackEvent, trackLead } = useAnalytics();

  // Track scroll depth with debouncing to prevent duplicates
  const trackScrollDepth = useCallback(() => {
    let scrollDepths = [25, 50, 75, 90];
    let trackedDepths = new Set<number>();
    let isTracking = false;

    const handleScroll = () => {
      if (isTracking) return;
      isTracking = true;
      
      // Debounce scroll tracking
      setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        scrollDepths.forEach(depth => {
          if (scrollPercentage >= depth && !trackedDepths.has(depth)) {
            trackedDepths.add(depth);
            trackEvent({
              action: 'scroll_depth',
              category: 'engagement',
              label: `${depth}%`,
              value: depth
            });
          }
        });
        isTracking = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  // Track form interactions
  const trackFormStart = useCallback((formType: string) => {
    trackEvent({
      action: 'form_start',
      category: 'conversion',
      label: formType,
      custom_parameters: {
        conversion_stage: 'form_started'
      }
    });
  }, [trackEvent]);

  const trackFormCompletion = useCallback((formType: string, formData: any) => {
    trackLead({
      lead_type: formType,
      value: formType === 'trial' ? 97 : 0,
      source: 'landing_page'
    });
    
    trackEvent({
      action: 'form_complete',
      category: 'conversion',
      label: formType,
      value: 1,
      custom_parameters: {
        conversion_stage: 'form_completed',
        business_type: formData.businessType || 'unknown'
      }
    });
  }, [trackEvent, trackLead]);

  const trackFormAbandonment = useCallback((formType: string, lastField: string) => {
    trackEvent({
      action: 'form_abandon',
      category: 'conversion',
      label: formType,
      custom_parameters: {
        conversion_stage: 'form_abandoned',
        last_field: lastField
      }
    });
  }, [trackEvent]);

  // Track CTA interactions
  const trackCTAClick = useCallback((ctaText: string, location: string) => {
    trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: ctaText,
      custom_parameters: {
        cta_location: location,
        conversion_stage: 'cta_clicked'
      }
    });
  }, [trackEvent]);

  // Track phone number reveals
  const trackPhoneReveal = useCallback(() => {
    trackEvent({
      action: 'phone_reveal',
      category: 'engagement',
      label: 'contact_intent',
      value: 1,
      custom_parameters: {
        conversion_stage: 'contact_intent'
      }
    });
  }, [trackEvent]);

  // Track time on page milestones with session management
  const trackTimeOnPage = useCallback(() => {
    const timeThresholds = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
    const startTime = Date.now();
    const sessionId = `session_${startTime}`;
    const trackedThresholds = new Set<number>();

    timeThresholds.forEach(threshold => {
      setTimeout(() => {
        // Prevent duplicate tracking for same session
        if (trackedThresholds.has(threshold)) return;
        trackedThresholds.add(threshold);
        
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: `${threshold}s`,
          value: threshold,
          custom_parameters: {
            session_id: sessionId,
            page_entry_time: startTime
          }
        });
      }, threshold * 1000);
    });

    // Cleanup on page unload
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        action: 'session_duration',
        category: 'engagement',
        label: 'page_exit',
        value: timeSpent,
        custom_parameters: {
          session_id: sessionId
        }
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [trackEvent]);

  useEffect(() => {
    const scrollCleanup = trackScrollDepth();
    const timeCleanup = trackTimeOnPage();
    
    return () => {
      scrollCleanup();
      timeCleanup();
    };
  }, [trackScrollDepth, trackTimeOnPage]);

  return {
    trackFormStart,
    trackFormCompletion,
    trackFormAbandonment,
    trackCTAClick,
    trackPhoneReveal
  };
};