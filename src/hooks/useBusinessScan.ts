import { useState } from "react";
import { ScanData } from "../components/business-scan/BusinessScanSection";
import { logger } from "@/utils/logger";

type ScanState = 'form' | 'scanning' | 'results' | 'leadgate' | 'success';

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

export const useBusinessScan = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleScanStart = async (businessName: string, businessLocation: string) => {
    logger.info('Business scan started', 'useBusinessScan', { businessName, businessLocation });
    setScanState('scanning');
    setProgress(0);
    setError(null);

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

  return {
    scanState,
    scanData,
    progress,
    error,
    handleScanStart,
    handleLeadCaptured,
    handleViewFullReport,
    setScanState
  };
};