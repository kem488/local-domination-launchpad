import { useState } from "react";
import { ScanData } from "../components/business-scan/BusinessScanSection";

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
    return 'We couldn\'t find your business. Try using a more specific business name or location.';
  }
  if (error?.message?.includes('API')) {
    return 'Our scanning service is temporarily unavailable. Please try again in a moment.';
  }
  if (error?.name === 'TypeError' || error?.message?.includes('fetch')) {
    return 'Connection error. Please check your internet connection and try again.';
  }
  return 'Sorry, we couldn\'t scan your business at the moment. Please try again.';
};

export const useBusinessScan = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleScanStart = async (businessName: string, businessLocation: string, name: string, email: string) => {
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
      // Enhanced lead capture with retry logic
      await withRetry(async () => {
        const leadResponse = await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/capture-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessName,
            businessLocation,
            name,
            email,
            source: 'initial-scan'
          })
        });

        if (!leadResponse.ok) {
          throw new Error(`Lead capture failed: ${leadResponse.status}`);
        }
        return leadResponse;
      });

      // Enhanced business scan with retry logic
      const result = await withRetry(async () => {
        const response = await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/scan-business', {
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
          throw new Error(`Scan failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Scan failed');
        }
        return data;
      });

      setProgress(100);
      setScanData(result);
      setTimeout(() => setScanState('results'), 1000);
      
    } catch (error) {
      console.error('Scan error:', error);
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