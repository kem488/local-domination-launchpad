import { useState } from "react";
import { ScanData } from "../components/business-scan/BusinessScanSection";

type ScanState = 'form' | 'scanning' | 'results' | 'trial-signup' | 'leadgate' | 'report';

export const useBusinessScan = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScanStart = async (businessName: string, businessLocation: string, name: string, email: string) => {
    setScanState('scanning');
    setProgress(0);

    // Simulate progress updates with AI generation phase
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 800);

    try {
      // Capture lead data first
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

      // Perform the business scan
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

      const result = await response.json();
      
      if (result.success) {
        setProgress(100);
        setScanData(result);
        setTimeout(() => setScanState('results'), 1000);
      } else {
        throw new Error(result.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setProgress(0);
      setScanState('form');
      
      // Show more specific error messages
      let errorMessage = 'Sorry, we couldn\'t scan your business at the moment.';
      
      if (error instanceof Error) {
        if (error.message.includes('couldn\'t find')) {
          errorMessage = error.message;
        } else if (error.message.includes('API')) {
          errorMessage = 'There was an issue with our scanning service. Please try again in a moment.';
        }
      }
      
      alert(errorMessage + ' If the issue persists, try using a more specific business name or location.');
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleLeadCaptured = () => {
    setScanState('report');
  };

  return {
    scanState,
    scanData,
    progress,
    handleScanStart,
    handleLeadCaptured,
    setScanState
  };
};