import { useEffect, useState } from 'react';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string; // Google Ads click ID
  fbclid?: string; // Facebook click ID
}

interface TrafficAttribution {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landing_page: string;
  timestamp: number;
}

export const useUTMTracking = () => {
  const [utmParams, setUtmParams] = useState<UTMParams>({});
  const [attribution, setAttribution] = useState<TrafficAttribution | null>(null);

  // Extract UTM parameters from URL
  const extractUTMParams = (): UTMParams => {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      gclid: urlParams.get('gclid') || undefined,
      fbclid: urlParams.get('fbclid') || undefined
    };
  };

  // Determine traffic source from referrer and UTM params
  const determineTrafficSource = (params: UTMParams, referrer: string): string => {
    // Direct UTM source
    if (params.utm_source) return params.utm_source;

    // Google Ads
    if (params.gclid) return 'google_ads';

    // Facebook Ads
    if (params.fbclid) return 'facebook_ads';

    // Referrer-based attribution
    if (!referrer || referrer === window.location.origin) return 'direct';

    if (referrer.includes('google.')) return 'google_organic';
    if (referrer.includes('facebook.')) return 'facebook_organic';
    if (referrer.includes('twitter.')) return 'twitter';
    if (referrer.includes('linkedin.')) return 'linkedin';
    if (referrer.includes('youtube.')) return 'youtube';
    if (referrer.includes('bing.')) return 'bing';

    return 'referral';
  };

  // Store attribution data in localStorage for session persistence
  const storeAttribution = (attribution: TrafficAttribution) => {
    try {
      localStorage.setItem('traffic_attribution', JSON.stringify(attribution));
      
      // Also store in sessionStorage for current session
      sessionStorage.setItem('current_session_attribution', JSON.stringify(attribution));
    } catch (error) {
      console.warn('Failed to store attribution data:', error);
    }
  };

  // Get stored attribution data
  const getStoredAttribution = (): TrafficAttribution | null => {
    try {
      // First check if this is a new session with fresh UTM params
      const currentParams = extractUTMParams();
      const hasNewParams = Object.values(currentParams).some(value => value !== undefined);

      if (hasNewParams) {
        // Clear old attribution if we have new UTM params
        localStorage.removeItem('traffic_attribution');
        return null;
      }

      // Otherwise, return stored attribution
      const stored = localStorage.getItem('traffic_attribution');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve attribution data:', error);
      return null;
    }
  };

  // Enhanced UTM parameter validation and cleaning
  const cleanUTMParams = (params: UTMParams): UTMParams => {
    const cleaned: UTMParams = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        // Clean and validate parameter values
        const cleanValue = decodeURIComponent(value)
          .toLowerCase()
          .trim()
          .replace(/[^\\w\\-_.]/g, '_'); // Replace special chars with underscore
        
        if (cleanValue && cleanValue !== 'undefined' && cleanValue !== 'null') {
          cleaned[key as keyof UTMParams] = cleanValue;
        }
      }
    });

    return cleaned;
  };

  // Generate attribution report
  const getAttributionReport = () => {
    const currentAttribution = attribution || getStoredAttribution();
    
    return {
      ...currentAttribution,
      utm_params: utmParams,
      session_data: {
        landing_page: window.location.pathname + window.location.search,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timestamp: Date.now()
      }
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for existing attribution first
    let existingAttribution = getStoredAttribution();
    
    // Extract and clean UTM parameters
    const rawParams = extractUTMParams();
    const cleanedParams = cleanUTMParams(rawParams);
    setUtmParams(cleanedParams);

    // Create new attribution if we don't have one or if we have new UTM params
    const hasNewParams = Object.values(cleanedParams).some(value => value !== undefined);
    
    if (!existingAttribution || hasNewParams) {
      const referrer = document.referrer;
      const source = determineTrafficSource(cleanedParams, referrer);
      
      const newAttribution: TrafficAttribution = {
        source,
        medium: cleanedParams.utm_medium || (source === 'direct' ? 'none' : 'referral'),
        campaign: cleanedParams.utm_campaign || 'not_set',
        referrer: referrer || 'direct',
        landing_page: window.location.pathname + window.location.search,
        timestamp: Date.now()
      };

      setAttribution(newAttribution);
      storeAttribution(newAttribution);
    } else {
      setAttribution(existingAttribution);
    }

    // Clean URL of UTM parameters after extraction (optional)
    if (hasNewParams && window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

  }, []);

  return {
    utmParams,
    attribution,
    getAttributionReport,
    refreshAttribution: () => {
      localStorage.removeItem('traffic_attribution');
      window.location.reload();
    }
  };
};
