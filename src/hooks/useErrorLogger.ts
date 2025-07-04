import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface ErrorLogData {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
  stack?: string;
  metadata?: Record<string, any>;
}

interface PerformanceLogData {
  metric: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  source: string;
  metadata?: Record<string, any>;
}

export const useErrorLogger = () => {
  const logError = useCallback(async (errorData: ErrorLogData) => {
    try {
      await supabase.functions.invoke('error-logger', {
        body: {
          type: 'error',
          ...errorData,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      // Fallback to console if logging fails
      console.error('Failed to log error:', error);
      console.error('Original error:', errorData);
    }
  }, []);

  const logPerformance = useCallback(async (perfData: PerformanceLogData) => {
    try {
      await supabase.functions.invoke('error-logger', {
        body: {
          type: 'performance',
          ...perfData,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.warn('Failed to log performance metric:', error);
    }
  }, []);

  const logSecurity = useCallback(async (eventType: string, metadata?: Record<string, any>) => {
    try {
      await supabase.functions.invoke('error-logger', {
        body: {
          type: 'security',
          eventType,
          metadata: {
            ...metadata,
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, []);

  // Global error handler setup
  const setupGlobalErrorHandling = useCallback(() => {
    // Handle unhandled errors
    window.addEventListener('error', (event) => {
      logError({
        level: 'error',
        message: event.message,
        source: event.filename || 'unknown',
        stack: event.error?.stack,
        metadata: {
          line: event.lineno,
          column: event.colno,
          type: 'javascript_error'
        }
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError({
        level: 'error',
        message: `Unhandled promise rejection: ${event.reason}`,
        source: 'promise_rejection',
        stack: event.reason?.stack,
        metadata: {
          type: 'unhandled_promise_rejection'
        }
      });
    });

    // Monitor performance
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Log navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navTiming = performance.getEntriesByType('navigation')[0] as any;
          if (navTiming) {
            logPerformance({
              metric: 'page_load_time',
              value: navTiming.loadEventEnd - navTiming.fetchStart,
              unit: 'ms',
              source: 'navigation_timing',
              metadata: {
                domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
                firstPaint: navTiming.responseStart - navTiming.fetchStart,
                url: window.location.href
              }
            });
          }
        }, 0);
      });

      // Monitor Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          logPerformance({
            metric: 'largest_contentful_paint',
            value: lastEntry.startTime,
            unit: 'ms',
            source: 'performance_observer'
          });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            logPerformance({
              metric: 'first_input_delay',
              value: entry.processingStart - entry.startTime,
              unit: 'ms',
              source: 'performance_observer'
            });
          });
        }).observe({ entryTypes: ['first-input'] });
      }
    }
  }, [logError, logPerformance]);

  return {
    logError,
    logPerformance,
    logSecurity,
    setupGlobalErrorHandling
  };
};