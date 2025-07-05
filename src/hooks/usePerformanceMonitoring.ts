import { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const usePerformanceMonitoring = () => {
  const metrics: PerformanceMetrics = {};

  const reportMetric = useCallback((name: string, value: number) => {
    // Track if metrics meet thresholds
    const thresholds = {
      lcp: 2500,  // 2.5s
      fid: 100,   // 100ms
      cls: 0.1    // 0.1
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (threshold) {
      const status = value <= threshold ? 'GOOD' : 'NEEDS_IMPROVEMENT';
      logger.info(`Core Web Vital ${name}`, 'usePerformanceMonitoring', { 
        metric: name, 
        value, 
        status 
      });
    }
  }, []);

  useEffect(() => {
    // LCP - Largest Contentful Paint
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime;
            reportMetric('lcp', lastEntry.startTime);
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    };

    // FID - First Input Delay
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              metrics.fid = fid;
              reportMetric('fid', fid);
            }
          });
        });
        observer.observe({ type: 'first-input', buffered: true });
      }
    };

    // CLS - Cumulative Layout Shift
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metrics.cls = clsValue;
          reportMetric('cls', clsValue);
        });
        observer.observe({ type: 'layout-shift', buffered: true });
      }
    };

    // FCP - First Contentful Paint
    const observeFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
              reportMetric('fcp', entry.startTime);
            }
          });
        });
        observer.observe({ type: 'paint', buffered: true });
      }
    };

    // TTFB - Time to First Byte
    const observeTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        metrics.ttfb = ttfb;
        reportMetric('ttfb', ttfb);
      }
    };

    // Initialize all observers
    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();
    observeTTFB();

    // Cleanup function
    return () => {
      // Observers are automatically cleaned up when component unmounts
    };
  }, [reportMetric]);

  return { metrics };
};