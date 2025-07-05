import { useEffect, useCallback } from 'react';

// Google Analytics 4 configuration - use environment detection
const GA_TRACKING_ID = 'G-JXQM8VZ2QK'; // Local Market Domination System GA4 ID
// Facebook Pixel configuration - disable in development
const FB_PIXEL_ID = import.meta.env.PROD ? '743853124791247' : null;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface EcommerceEvent {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}

export const useAnalytics = () => {
  // Initialize Google Analytics 4
  const initializeGA4 = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      send_page_view: true,
      enhanced_ecommerce: true,
      custom_map: {
        custom_parameter_1: 'lead_source',
        custom_parameter_2: 'conversion_stage'
      }
    });
  }, []);

  // Initialize Facebook Pixel
  const initializeFacebookPixel = useCallback(() => {
    if (typeof window === 'undefined' || !FB_PIXEL_ID) return;

    // Prevent double initialization
    if ((window as any).fbq) return;

    // Facebook Pixel code
    (window as any).fbq = function() {
      (window as any).fbq.callMethod ? 
        (window as any).fbq.callMethod.apply((window as any).fbq, arguments) : 
        (window as any).fbq.queue.push(arguments);
    };
    if (!(window as any).fbq.version) {
      (window as any).fbq.version = '2.0';
      (window as any).fbq.queue = [];
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }

    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Facebook Pixel - only if enabled
    if (window.fbq && FB_PIXEL_ID) {
      window.fbq('track', 'CustomEvent', {
        action: event.action,
        category: event.category,
        label: event.label,
        value: event.value
      });
    }
  }, []);

  // Track ecommerce events
  const trackPurchase = useCallback((data: EcommerceEvent) => {
    // Google Analytics 4 Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `txn_${Date.now()}`,
        value: data.value,
        currency: data.currency,
        items: data.items
      });
    }

    // Facebook Pixel Purchase - only if enabled
    if (window.fbq && FB_PIXEL_ID) {
      window.fbq('track', 'Purchase', {
        value: data.value,
        currency: data.currency,
        contents: data.items
      });
    }
  }, []);

  // Track lead generation
  const trackLead = useCallback((leadData: {
    lead_type: string;
    value?: number;
    source?: string;
  }) => {
    trackEvent({
      action: 'generate_lead',
      category: 'conversion',
      label: leadData.lead_type,
      value: leadData.value || 0,
      custom_parameters: {
        lead_source: leadData.source,
        conversion_stage: 'lead_generated'
      }
    });

    // Facebook Pixel Lead - only if enabled
    if (window.fbq && FB_PIXEL_ID) {
      window.fbq('track', 'Lead', {
        content_name: leadData.lead_type,
        content_category: 'lead_generation',
        value: leadData.value || 0
      });
    }
  }, [trackEvent]);

  // Track page views with UTM parameters
  const trackPageView = useCallback((page: string, utmParams?: Record<string, string>) => {
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: page,
        custom_map: utmParams
      });
    }

    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: page,
      custom_parameters: utmParams
    });
  }, [trackEvent]);

  // Initialize analytics on mount
  useEffect(() => {
    initializeGA4();
    // Only initialize Facebook Pixel in production
    if (FB_PIXEL_ID) {
      initializeFacebookPixel();
    }
  }, [initializeGA4, initializeFacebookPixel]);

  return {
    trackEvent,
    trackPurchase,
    trackLead,
    trackPageView
  };
};