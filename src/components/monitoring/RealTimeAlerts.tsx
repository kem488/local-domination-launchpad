import { useEffect, useCallback } from 'react';
import { useErrorLogger } from '@/hooks/useErrorLogger';

interface AlertThresholds {
  errorRate: number;
  responseTime: number;
  errorCount: number;
}

const DEFAULT_THRESHOLDS: AlertThresholds = {
  errorRate: 0.05, // 5% error rate
  responseTime: 5000, // 5 seconds
  errorCount: 10 // 10 errors in 5 minutes
};

export const RealTimeAlerts = () => {
  const { logError, logPerformance } = useErrorLogger();
  
  const checkSystemHealth = useCallback(async () => {
    try {
      // Monitor API health
      const healthCheckStart = performance.now();
      const response = await fetch('/health', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      const responseTime = performance.now() - healthCheckStart;
      
      if (!response.ok) {
        logError({
          level: 'error',
          message: `Health check failed: ${response.status}`,
          source: 'health_monitor',
          metadata: {
            status: response.status,
            responseTime
          }
        });
      }
      
      // Log performance metric
      logPerformance({
        metric: 'health_check_response_time',
        value: responseTime,
        unit: 'ms',
        source: 'health_monitor'
      });
      
      // Alert if response time exceeds threshold
      if (responseTime > DEFAULT_THRESHOLDS.responseTime) {
        logError({
          level: 'warn',
          message: `Slow health check response: ${responseTime}ms`,
          source: 'performance_monitor',
          metadata: {
            responseTime,
            threshold: DEFAULT_THRESHOLDS.responseTime
          }
        });
      }
      
    } catch (error) {
      logError({
        level: 'error',
        message: `Health check failed: ${error}`,
        source: 'health_monitor',
        metadata: {
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }, [logError, logPerformance]);
  
  // Monitor console errors in real-time
  useEffect(() => {
    const originalConsoleError = console.error;
    let errorCount = 0;
    const errorWindow = 5 * 60 * 1000; // 5 minutes
    const errorTimestamps: number[] = [];
    
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      const now = Date.now();
      errorTimestamps.push(now);
      
      // Remove errors outside the time window
      while (errorTimestamps.length > 0 && errorTimestamps[0] < now - errorWindow) {
        errorTimestamps.shift();
      }
      
      errorCount = errorTimestamps.length;
      
      // Alert if error count exceeds threshold
      if (errorCount >= DEFAULT_THRESHOLDS.errorCount) {
        logError({
          level: 'error', 
          message: `High error rate detected: ${errorCount} errors in 5 minutes`,
          source: 'error_rate_monitor',
          metadata: {
            errorCount,
            threshold: DEFAULT_THRESHOLDS.errorCount,
            timeWindow: errorWindow
          }
        });
      }
      
      // Log individual error
      logError({
        level: 'error',
        message: args.join(' '),
        source: 'console_error',
        metadata: {
          args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
        }
      });
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, [logError]);
  
  // Periodic health checks
  useEffect(() => {
    // Initial health check
    checkSystemHealth();
    
    // Schedule periodic health checks every 2 minutes
    const interval = setInterval(checkSystemHealth, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkSystemHealth]);
  
  // Monitor network failures
  useEffect(() => {
    const handleOnline = () => {
      logError({
        level: 'info',
        message: 'Network connection restored',
        source: 'network_monitor'
      });
    };
    
    const handleOffline = () => {
      logError({
        level: 'error',
        message: 'Network connection lost',
        source: 'network_monitor'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [logError]);
  
  return null; // This component doesn't render anything
};