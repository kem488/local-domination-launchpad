import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ConversionFunnel {
  step: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  dropoffRate: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  timestamp: number;
}

export const useConversionTracking = () => {
  const { trackEvent } = useAnalytics();
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);

  // Define conversion funnel steps
  const funnelSteps = [
    { step: 'landing_page_view', name: 'Landing Page View' },
    { step: 'business_scan_started', name: 'Business Scan Started' },
    { step: 'email_captured', name: 'Email Captured' },
    { step: 'trial_signup', name: 'Trial Signup' },
    { step: 'payment_completed', name: 'Payment Completed' }
  ];

  // Performance thresholds for alerts
  const thresholds = {
    conversion_rate: 2.0, // Minimum 2% conversion rate
    bounce_rate: 70.0, // Maximum 70% bounce rate
    page_load_time: 3000, // Maximum 3 seconds
    error_rate: 5.0, // Maximum 5% error rate
    form_abandonment: 60.0 // Maximum 60% form abandonment
  };

  // Track funnel step completion
  const trackFunnelStep = (step: string, additionalData?: Record<string, any>) => {
    trackEvent({
      action: 'funnel_step',
      category: 'conversion',
      label: step,
      custom_parameters: {
        funnel_step: step,
        step_timestamp: Date.now(),
        ...additionalData
      }
    });

    // Update funnel data
    updateFunnelData(step);
  };

  // Update funnel data with new conversion
  const updateFunnelData = (step: string) => {
    setFunnelData(prev => {
      const updated = [...prev];
      const stepIndex = updated.findIndex(item => item.step === step);
      
      if (stepIndex >= 0) {
        updated[stepIndex] = {
          ...updated[stepIndex],
          conversions: updated[stepIndex].conversions + 1
        };
        
        // Recalculate conversion rates
        return updated.map((item, index) => {
          const previousStep = index > 0 ? updated[index - 1] : null;
          const visitors = previousStep ? previousStep.conversions : item.visitors;
          const conversionRate = visitors > 0 ? (item.conversions / visitors) * 100 : 0;
          const dropoffRate = 100 - conversionRate;
          
          return {
            ...item,
            conversionRate,
            dropoffRate
          };
        });
      }
      
      return prev;
    });
  };

  // Check performance metrics and create alerts
  const checkPerformanceAlerts = (metrics: Record<string, number>) => {
    const newAlerts: PerformanceAlert[] = [];

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const currentValue = metrics[metric];
      if (currentValue !== undefined) {
        const isAboveThreshold = ['bounce_rate', 'page_load_time', 'error_rate', 'form_abandonment']
          .includes(metric) ? currentValue > threshold : currentValue < threshold;

        if (isAboveThreshold) {
          const alertType = currentValue > threshold * 1.5 ? 'critical' : 'warning';
          
          newAlerts.push({
            id: `${metric}_${Date.now()}`,
            type: alertType,
            metric,
            currentValue,
            threshold,
            message: generateAlertMessage(metric, currentValue, threshold),
            timestamp: Date.now()
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    }
  };

  // Generate alert message
  const generateAlertMessage = (metric: string, value: number, threshold: number): string => {
    const metricNames = {
      conversion_rate: 'Conversion Rate',
      bounce_rate: 'Bounce Rate',
      page_load_time: 'Page Load Time',
      error_rate: 'Error Rate',
      form_abandonment: 'Form Abandonment Rate'
    };

    const metricName = metricNames[metric as keyof typeof metricNames] || metric;
    const unit = metric === 'page_load_time' ? 'ms' : '%';
    
    return `${metricName} is ${value}${unit}, ${value > threshold ? 'above' : 'below'} threshold of ${threshold}${unit}`;
  };

  // Initialize funnel data
  useEffect(() => {
    const initialFunnelData: ConversionFunnel[] = funnelSteps.map((step, index) => ({
      step: step.step,
      visitors: index === 0 ? 1000 : 0, // Mock initial visitors for first step
      conversions: 0,
      conversionRate: 0,
      dropoffRate: 0
    }));

    setFunnelData(initialFunnelData);
  }, []);

  // Simulate performance monitoring (in production, this would come from your analytics)
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock performance metrics
      const mockMetrics = {
        conversion_rate: Math.random() * 5, // 0-5%
        bounce_rate: 40 + Math.random() * 40, // 40-80%
        page_load_time: 1000 + Math.random() * 3000, // 1-4 seconds
        error_rate: Math.random() * 10, // 0-10%
        form_abandonment: 30 + Math.random() * 50 // 30-80%
      };

      checkPerformanceAlerts(mockMetrics);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Conversion rate optimization suggestions
  const getOptimizationSuggestions = () => {
    const suggestions = [];

    // Analyze funnel data for optimization opportunities
    funnelData.forEach((step, index) => {
      if (step.dropoffRate > 50 && index > 0) {
        suggestions.push({
          step: step.step,
          issue: 'High drop-off rate',
          suggestion: `Optimize ${step.step} to reduce ${step.dropoffRate.toFixed(1)}% drop-off rate`,
          priority: step.dropoffRate > 70 ? 'high' : 'medium'
        });
      }
    });

    return suggestions;
  };

  return {
    funnelData,
    alerts,
    trackFunnelStep,
    checkPerformanceAlerts,
    getOptimizationSuggestions,
    clearAlert: (alertId: string) => {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };
};