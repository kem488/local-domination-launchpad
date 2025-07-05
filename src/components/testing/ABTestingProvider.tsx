import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ABTest {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    weight: number;
    active: boolean;
  }[];
  status: 'draft' | 'running' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: Date;
  conversionEvents: string[];
}

interface ABTestingContextType {
  getVariant: (testId: string) => string | null;
  trackConversion: (testId: string, eventName: string) => void;
  registerTest: (test: ABTest) => void;
  getActiveTests: () => ABTest[];
}

const ABTestingContext = createContext<ABTestingContextType | null>(null);

export const useABTesting = () => {
  const context = useContext(ABTestingContext);
  if (!context) {
    throw new Error('useABTesting must be used within ABTestingProvider');
  }
  return context;
};

interface ABTestingProviderProps {
  children: ReactNode;
}

export const ABTestingProvider: React.FC<ABTestingProviderProps> = ({ children }) => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [userVariants, setUserVariants] = useState<Record<string, string>>({});
  const { trackEvent } = useAnalytics();

  // Generate consistent user ID for test assignment
  const getUserId = (): string => {
    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  };

  // Hash function for consistent variant assignment
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Assign user to variant based on test configuration
  const assignVariant = (test: ABTest, userId: string): string => {
    const activeVariants = test.variants.filter(v => v.active);
    if (activeVariants.length === 0) return test.variants[0]?.id || '';

    const hash = hashString(`${test.id}_${userId}`);
    const totalWeight = activeVariants.reduce((sum, v) => sum + v.weight, 0);
    const normalizedHash = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of activeVariants) {
      cumulativeWeight += (variant.weight / totalWeight) * 100;
      if (normalizedHash < cumulativeWeight) {
        return variant.id;
      }
    }
    
    return activeVariants[0].id;
  };

  // Get variant for a specific test
  const getVariant = (testId: string): string | null => {
    const test = tests.find(t => t.id === testId && t.status === 'running');
    if (!test) return null;

    // Check if user already has an assigned variant
    if (userVariants[testId]) {
      return userVariants[testId];
    }

    // Assign new variant
    const userId = getUserId();
    const variantId = assignVariant(test, userId);
    
    // Store assignment
    const newUserVariants = { ...userVariants, [testId]: variantId };
    setUserVariants(newUserVariants);
    localStorage.setItem('ab_test_variants', JSON.stringify(newUserVariants));

    // Track assignment event
    trackEvent({
      action: 'ab_test_assignment',
      category: 'testing',
      label: `${testId}:${variantId}`,
      custom_parameters: {
        test_name: test.name,
        variant_name: test.variants.find(v => v.id === variantId)?.name,
        user_id: userId
      }
    });

    return variantId;
  };

  // Track conversion event
  const trackConversion = (testId: string, eventName: string) => {
    const variantId = userVariants[testId];
    if (!variantId) return;

    const test = tests.find(t => t.id === testId);
    if (!test) return;

    trackEvent({
      action: 'ab_test_conversion',
      category: 'testing',
      label: `${testId}:${variantId}:${eventName}`,
      custom_parameters: {
        test_name: test.name,
        variant_name: test.variants.find(v => v.id === variantId)?.name,
        conversion_event: eventName,
        user_id: getUserId()
      }
    });
  };

  // Register a new test
  const registerTest = (test: ABTest) => {
    setTests(prev => {
      const existing = prev.find(t => t.id === test.id);
      if (existing) {
        return prev.map(t => t.id === test.id ? test : t);
      }
      return [...prev, test];
    });
  };

  // Get all active tests
  const getActiveTests = (): ABTest[] => {
    return tests.filter(test => test.status === 'running');
  };

  // Load stored variants on initialization
  useEffect(() => {
    const storedVariants = localStorage.getItem('ab_test_variants');
    if (storedVariants) {
      try {
        setUserVariants(JSON.parse(storedVariants));
      } catch (error) {
        // Silently handle parse errors in production
      }
    }
  }, []);

  // Initialize default tests
  useEffect(() => {
    const defaultTests: ABTest[] = [
      {
        id: 'pricing_cta',
        name: 'Pricing CTA Text',
        variants: [
          { id: 'control', name: 'Secure My £97 Rate', weight: 50, active: true },
          { id: 'variant_a', name: 'Lock In My Discount', weight: 50, active: true }
        ],
        status: 'running'
      },
      {
        id: 'hero_headline',
        name: 'Hero Headline Test',
        variants: [
          { id: 'control', name: 'Current Headline', weight: 50, active: true },
          { id: 'variant_a', name: 'Alternative Headline', weight: 50, active: true }
        ],
        status: 'running'
      }
    ];

    defaultTests.forEach(registerTest);
  }, []);

  const contextValue: ABTestingContextType = {
    getVariant,
    trackConversion,
    registerTest,
    getActiveTests
  };

  return (
    <ABTestingContext.Provider value={contextValue}>
      {children}
    </ABTestingContext.Provider>
  );
};

// Hook for easy component-level A/B testing
export const useABTest = (testId: string) => {
  const { getVariant, trackConversion } = useABTesting();
  const variant = getVariant(testId);
  
  return {
    variant,
    isVariant: (variantId: string) => variant === variantId,
    trackConversion: (eventName: string) => trackConversion(testId, eventName)
  };
};