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

  const handleScanStart = async (businessName: string, businessLocation: string) => {
    console.log('🚀 CACHE TEST: handleScanStart called at', new Date().toISOString());
    console.log('🚀 Starting business scan for:', { businessName, businessLocation });
    console.log('🚀 IMPORTANT: This should call scan-business NOT capture-lead');
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
      console.log('🔍 Starting business scan...');
      // Enhanced business scan with retry logic
      const result = await withRetry(async () => {
        const scanUrl = 'https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/scan-business';
        console.log('🔍 Calling scan endpoint:', scanUrl);
        
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

        console.log('🔍 Scan response status:', response.status);
        console.log('🔍 Scan response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('🔍 Scan request failed:', { 
            status: response.status, 
            statusText: response.statusText,
            body: errorText 
          });
          throw new Error(`Scan failed: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🔍 Scan response data:', data);
        
        if (!data.success) {
          console.error('🔍 Scan returned unsuccessful result:', data);
          throw new Error(data.error || 'Scan failed - no success flag');
        }
        
        console.log('✅ Scan successful');
        return data;
      });

      console.log('🎉 All steps completed successfully, setting results...');
      setProgress(100);
      setScanData(result);
      setTimeout(() => {
        console.log('🎉 Transitioning to results state');
        setScanState('results');
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Scan error occurred:', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      const errorMessage = getErrorMessage(error);
      console.error('❌ Processed error message:', errorMessage);
      
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
      console.log('🏁 Scan process completed');
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