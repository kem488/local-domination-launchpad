import { useState } from "react";
import { ScanData } from "../components/business-scan/BusinessScanSection";
import { logger } from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";

type ScanState = 'form' | 'scanning' | 'results' | 'leadgate' | 'success';
type AIGenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';

// Enhanced error handling with retry logic
const withRetry = async <T>(
  operation: () => Promise<T>, 
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
};

// Enhanced error messages for better UX
const getErrorMessage = (error: any): string => {
  if (error?.message?.includes('couldn\'t find')) {
    return 'We couldn\'t find your business on Google. Please try:\n• Using your exact business name as it appears on Google\n• Including your city or postcode\n• Checking if your business has a Google Business Profile';
  }
  if (error?.message?.includes('API')) {
    return 'Our scanning service is temporarily busy. This usually resolves quickly - please try again in 30 seconds.';
  }
  if (error?.name === 'TypeError' || error?.message?.includes('fetch')) {
    return 'Connection issue detected. Please check your internet connection and try again. If the problem persists, try refreshing the page.';
  }
  if (error?.message?.includes('rate limit')) {
    return 'Too many scan requests. Please wait 60 seconds before trying again to ensure accurate results.';
  }
  return 'Scan temporarily unavailable. Our technical team has been notified. Please try again in a few minutes or contact support if this continues.';
};

// Fallback AI recommendations for graceful degradation
const getFallbackRecommendations = (scanData: ScanData) => {
  const { scores, placeDetails } = scanData;
  
  const quickWins = [];
  const recommendations = [];
  
  if (scores.photos < 70) {
    quickWins.push("Add high-quality photos of your work and business");
    recommendations.push({
      category: "Visual Content",
      action: "Upload 10-15 high-quality photos showcasing your work, team, and business location",
      impact: "Photos can increase customer engagement by 42% and build trust with potential clients",
      timeframe: "1-2 days",
      difficulty: "easy"
    });
  }
  
  if (scores.reviews < 70) {
    quickWins.push("Ask satisfied customers to leave Google reviews");
    recommendations.push({
      category: "Review Management", 
      action: "Implement a systematic approach to request reviews from happy customers",
      impact: "More reviews improve local search rankings and customer trust",
      timeframe: "2-4 weeks",
      difficulty: "medium"
    });
  }
  
  if (scores.completeness < 80) {
    quickWins.push("Complete all missing profile information");
    recommendations.push({
      category: "Profile Optimization",
      action: "Fill in missing business hours, contact details, services, and description",
      impact: "Complete profiles get 2x more customer actions than incomplete ones",
      timeframe: "1 week", 
      difficulty: "easy"
    });
  }
  
  // Always include at least basic recommendations
  if (recommendations.length === 0) {
    quickWins.push("Optimize your Google Business Profile for better visibility");
    recommendations.push({
      category: "General Optimization",
      action: "Regularly update your business information and engage with customer reviews",
      impact: "Active profiles perform better in local search results",
      timeframe: "Ongoing",
      difficulty: "easy"
    });
  }
  
  return {
    priority: scores.overall < 50 ? "critical" : scores.overall < 70 ? "high" : "medium",
    quickWins: quickWins.slice(0, 3),
    recommendations: recommendations.slice(0, 4),
    profileGaps: `Your Google Business Profile needs attention in ${recommendations.length} key areas to improve local search visibility`,
    revenueImpact: `Implementing these improvements could increase your online leads by 25-40% within 3 months`
  };
};

export const useBusinessScan = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiGenerationStatus, setAiGenerationStatus] = useState<AIGenerationStatus>('pending');

  const handleScanStart = async (businessName: string, businessLocation: string) => {
    logger.info('Business scan started', 'useBusinessScan', { businessName, businessLocation });
    setScanState('scanning');
    setProgress(0);
    setError(null);
    setAiGenerationStatus('pending');

    // Enhanced progress tracking with more realistic simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        // More realistic progress curve
        const increment = prev < 30 ? Math.random() * 15 : 
                         prev < 60 ? Math.random() * 10 : 
                         Math.random() * 5;
        return Math.min(prev + increment, 95);
      });
    }, 600);

    try {
      logger.info('Starting business scan API call', 'useBusinessScan');
      // Enhanced business scan with retry logic
      const result = await withRetry(async () => {
        const scanUrl = 'https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/scan-business';
        
        const response = await fetch(scanUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessName,
            businessLocation
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Scan request failed', 'useBusinessScan', { 
            status: response.status, 
            statusText: response.statusText,
            body: errorText 
          });
          throw new Error(`Scan failed: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          logger.error('Scan returned unsuccessful result', 'useBusinessScan', data);
          throw new Error(data.error || 'Scan failed - no success flag');
        }
        
        logger.info('Scan completed successfully', 'useBusinessScan');
        return data;
      });

      setProgress(100);
      setScanData(result);
      
      // Start AI generation immediately and set up real-time listener
      setAiGenerationStatus('generating');
      logger.info('Starting AI recommendation generation', 'useBusinessScan', { scanId: result.scanId });

      // Set up real-time subscription to listen for AI recommendations
      const channel = supabase
        .channel('ai-recommendations')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'business_scans',
            filter: `id=eq.${result.scanId}`
          },
          (payload) => {
            logger.info('Real-time AI recommendations update received', 'useBusinessScan', payload);
            
            if (payload.new?.ai_recommendations) {
              try {
                const recommendations = JSON.parse(payload.new.ai_recommendations);
                if (recommendations && typeof recommendations === 'object') {
                  setAiGenerationStatus('completed');
                  setScanData(prev => prev ? { ...prev, aiRecommendations: recommendations } : null);
                  logger.info('AI recommendations updated via real-time', 'useBusinessScan');
                }
              } catch (parseError) {
                logger.error('Failed to parse real-time AI recommendations', 'useBusinessScan', parseError);
                // Keep generating status, will fall back to polling
              }
            }
          }
        )
        .subscribe();

      // Trigger AI generation
      try {
        await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/generate-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scanId: result.scanId,
            businessData: { businessName, businessLocation },
            scanResults: {
              overallScore: result.scores.overall,
              reviewsScore: result.scores.reviews,
              completenessScore: result.scores.completeness,
              photosScore: result.scores.photos,
              engagementScore: result.scores.engagement
            },
            placeDetails: result.placeDetails
          })
        });
      } catch (aiError) {
        logger.error('AI generation request failed, using fallback', 'useBusinessScan', aiError);
        // Use fallback recommendations immediately
        const fallbackRecommendations = getFallbackRecommendations(result);
        setScanData(prev => prev ? { ...prev, aiRecommendations: fallbackRecommendations } : null);
        setAiGenerationStatus('completed');
      }

      // Fallback timeout - if AI doesn't complete in 15 seconds, use fallback
      setTimeout(() => {
        if (aiGenerationStatus === 'generating') {
          logger.info('AI generation timeout, using fallback recommendations', 'useBusinessScan');
          const fallbackRecommendations = getFallbackRecommendations(result);
          setScanData(prev => prev ? { ...prev, aiRecommendations: fallbackRecommendations } : null);
          setAiGenerationStatus('completed');
        }
        // Clean up real-time subscription
        supabase.removeChannel(channel);
      }, 15000);

      setTimeout(() => {
        setScanState('results');
      }, 1000);
      
    } catch (error: any) {
      logger.error('Scan error occurred', 'useBusinessScan', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      const errorMessage = getErrorMessage(error);
      
      setError(errorMessage);
      setProgress(0);
      setScanState('form');
      setAiGenerationStatus('failed');
      
      // Use toast instead of alert for better UX
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            title: 'Scan Failed',
            description: errorMessage,
            variant: 'destructive'
          }
        }));
      }
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleLeadCaptured = () => {
    setScanState('success');
  };

  const handleViewFullReport = () => {
    setScanState('leadgate');
  };

  const updateAiGenerationStatus = (status: AIGenerationStatus) => {
    setAiGenerationStatus(status);
  };

  return {
    scanState,
    scanData,
    progress,
    error,
    aiGenerationStatus,
    handleScanStart,
    handleLeadCaptured,
    handleViewFullReport,
    updateAiGenerationStatus,
    setScanState
  };
};
