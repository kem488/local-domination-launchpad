import { useState, useEffect } from 'react';

export interface ABTest {
  name: string;
  variants: string[];
  weights?: number[];
}

export interface ABTestResult {
  variant: string;
  variantIndex: number;
}

const AB_TESTS: Record<string, ABTest> = {
  hero_headline: {
    name: 'hero_headline',
    variants: [
      'Stop the Feast-or-Famine Cycle',
      'Get Predictable Leads Every Month', 
      'Beat Your Competitors at Their Own Game'
    ]
  },
  cta_button: {
    name: 'cta_button',
    variants: [
      'Secure My £97 Rate',
      'Get My Business Scan',
      'Lock In Lifetime Pricing'
    ]
  },
  pricing_display: {
    name: 'pricing_display',
    variants: ['standard', 'savings_focused', 'urgency_focused']
  }
};

export const useABTest = (testName: string): ABTestResult => {
  const [result, setResult] = useState<ABTestResult>({ variant: '', variantIndex: 0 });

  useEffect(() => {
    const test = AB_TESTS[testName];
    if (!test) {
      console.warn(`AB test '${testName}' not found`);
      return;
    }

    // Check for existing assignment in localStorage
    const storageKey = `ab_test_${testName}`;
    const existing = localStorage.getItem(storageKey);
    
    if (existing) {
      const parsed = JSON.parse(existing);
      setResult(parsed);
      return;
    }

    // Assign new variant
    const weights = test.weights || test.variants.map(() => 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    const newResult = {
      variant: test.variants[selectedIndex],
      variantIndex: selectedIndex
    };

    // Store assignment
    localStorage.setItem(storageKey, JSON.stringify(newResult));
    setResult(newResult);

    // Track assignment
    trackABTestAssignment(testName, newResult.variant);
  }, [testName]);

  return result;
};

export const trackABTestAssignment = (testName: string, variant: string) => {
  // Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ab_test_assignment', {
      test_name: testName,
      variant: variant,
      event_category: 'AB Testing'
    });
  }
  
  console.log(`AB Test Assignment: ${testName} -> ${variant}`);
};

export const trackConversion = (eventName: string, section: string, details?: Record<string, any>) => {
  const timestamp = Date.now();
  
  // Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      section: section,
      timestamp: timestamp,
      event_category: 'Conversion',
      ...details
    });
  }

  // Store conversion for analysis
  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
  conversions.push({
    event: eventName,
    section,
    timestamp,
    details,
    url: window.location.href,
    userAgent: navigator.userAgent
  });
  localStorage.setItem('conversions', JSON.stringify(conversions.slice(-100))); // Keep last 100

  console.log(`Conversion: ${eventName} in ${section}`, details);
};

export const trackEngagement = (action: string, element: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'engagement', {
      action,
      element,
      value,
      event_category: 'User Engagement'
    });
  }
};