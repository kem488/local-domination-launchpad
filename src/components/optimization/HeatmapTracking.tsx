import { useEffect } from 'react';

// Hotjar tracking code
const HOTJAR_ID = 1234567; // Replace with actual Hotjar site ID
const HOTJAR_VERSION = 6;

export const HeatmapTracking = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hostname === 'localhost') {
      return; // Don't load in development
    }

    // Hotjar initialization
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { 
        (h.hj.q = h.hj.q || []).push(arguments); 
      };
      h._hjSettings = { hjid: HOTJAR_ID, hjsv: HOTJAR_VERSION };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

    // Additional heat mapping setup for custom tracking
    const setupCustomTracking = () => {
      // Track form interactions
      const forms = document.querySelectorAll('form');
      forms.forEach((form, index) => {
        form.addEventListener('submit', () => {
          if (window.hj) {
            window.hj('event', 'form_submission', {
              form_id: form.id || `form_${index}`,
              form_action: form.action,
              timestamp: Date.now()
            });
          }
        });
      });

      // Track CTA button clicks
      const ctaButtons = document.querySelectorAll('[data-cta], .btn-primary, [id*="cta"]');
      ctaButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          if (window.hj) {
            window.hj('event', 'cta_click', {
              button_id: button.id || `cta_${index}`,
              button_text: button.textContent?.trim(),
              position: index,
              timestamp: Date.now()
            });
          }
        });
      });

      // Track section visibility
      const sections = document.querySelectorAll('section[id]');
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && window.hj) {
              window.hj('event', 'section_view', {
                section_id: entry.target.id,
                visibility_ratio: entry.intersectionRatio,
                timestamp: Date.now()
              });
            }
          });
        },
        { threshold: 0.5 }
      );

      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    };

    // Setup custom tracking after a short delay to ensure DOM is ready
    setTimeout(setupCustomTracking, 1000);

    // Cleanup function
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return null;
};

// Declare global Hotjar interface
declare global {
  interface Window {
    hj: (...args: any[]) => void;
    _hjSettings: {
      hjid: number;
      hjsv: number;
    };
  }
}