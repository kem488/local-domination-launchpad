
import { useState } from "react";
import { ScanData } from "../components/business-scan/BusinessScanSection";
import { BusinessScanService } from "@/services/businessScanService";
import { getErrorMessage, logError, showToastError } from "@/utils/scanErrorHandler";

type ScanState = 'form' | 'scanning' | 'results' | 'leadgate' | 'success';
type AIGenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';

export const useBusinessScan = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiGenerationStatus, setAiGenerationStatus] = useState<AIGenerationStatus>('pending');

  const handleScanStart = async (businessName: string, businessLocation: string) => {
    setScanState('scanning');
    setProgress(0);
    setError(null);
    setAiGenerationStatus('pending');

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        const increment = prev < 30 ? Math.random() * 15 : 
                         prev < 60 ? Math.random() * 10 : 
                         Math.random() * 5;
        return Math.min(prev + increment, 95);
      });
    }, 600);

    try {
      // Perform the scan
      const result = await BusinessScanService.performScan(businessName, businessLocation);
      setProgress(100);
      setScanData(result);
      
      // Start AI generation
      setAiGenerationStatus('generating');
      
      // Set up real-time subscription
      const channel = BusinessScanService.setupRealtimeSubscription(
        result.scanId,
        (recommendations) => {
          setAiGenerationStatus('completed');
          setScanData(prev => prev ? { ...prev, aiRecommendations: recommendations } : null);
        }
      );

      // Trigger AI generation
      try {
        await BusinessScanService.generateAIRecommendations(
          result.scanId, 
          businessName, 
          businessLocation, 
          result
        );
      } catch (aiError) {
        // Use fallback recommendations
        const fallbackRecommendations = BusinessScanService.getFallbackRecommendations(result);
        setScanData(prev => prev ? { ...prev, aiRecommendations: fallbackRecommendations } : null);
        setAiGenerationStatus('completed');
      }

      // Fallback timeout
      setTimeout(() => {
        if (aiGenerationStatus === 'generating') {
          const fallbackRecommendations = BusinessScanService.getFallbackRecommendations(result);
          setScanData(prev => prev ? { ...prev, aiRecommendations: fallbackRecommendations } : null);
          setAiGenerationStatus('completed');
        }
        channel && supabase.removeChannel(channel);
      }, 15000);

      setTimeout(() => {
        setScanState('results');
      }, 1000);
      
    } catch (error: any) {
      logError(error, 'handleScanStart', { businessName, businessLocation });
      
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      setProgress(0);
      setScanState('form');
      setAiGenerationStatus('failed');
      
      showToastError('Scan Failed', errorMessage);
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
