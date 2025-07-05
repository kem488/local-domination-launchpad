
import { ScanData } from "@/components/business-scan/BusinessScanSection";
import { withRetry, logError } from "@/utils/scanErrorHandler";
import { getFallbackRecommendations } from "@/utils/scanFallbacks";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export class BusinessScanService {
  private static readonly SCAN_URL = 'https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/scan-business';
  private static readonly AI_URL = 'https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/generate-recommendations';

  static async performScan(businessName: string, businessLocation: string): Promise<ScanData> {
    logger.info('Starting business scan API call', 'BusinessScanService');
    
    const result = await withRetry(async () => {
      const response = await fetch(this.SCAN_URL, {
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
        logger.error('Scan request failed', 'BusinessScanService', { 
          status: response.status, 
          statusText: response.statusText,
          body: errorText 
        });
        throw new Error(`Scan failed: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        logger.error('Scan returned unsuccessful result', 'BusinessScanService', data);
        throw new Error(data.error || 'Scan failed - no success flag');
      }
      
      logger.info('Scan completed successfully', 'BusinessScanService');
      return data;
    });

    return result;
  }

  static async generateAIRecommendations(
    scanId: string, 
    businessName: string, 
    businessLocation: string, 
    scanData: ScanData
  ): Promise<void> {
    try {
      await fetch(this.AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId,
          businessData: { businessName, businessLocation },
          scanResults: {
            overallScore: scanData.scores.overall,
            reviewsScore: scanData.scores.reviews,
            completenessScore: scanData.scores.completeness,
            photosScore: scanData.scores.photos,
            engagementScore: scanData.scores.engagement
          },
          placeDetails: scanData.placeDetails
        })
      });
    } catch (aiError) {
      logError(aiError, 'AI generation request', { scanId });
      throw aiError;
    }
  }

  static setupRealtimeSubscription(
    scanId: string,
    onUpdate: (recommendations: any) => void
  ) {
    const channel = supabase
      .channel('ai-recommendations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'business_scans',
          filter: `id=eq.${scanId}`
        },
        (payload) => {
          logger.info('Real-time AI recommendations update received', 'BusinessScanService', payload);
          
          if (payload.new?.ai_recommendations) {
            try {
              const recommendations = JSON.parse(payload.new.ai_recommendations);
              if (recommendations && typeof recommendations === 'object') {
                onUpdate(recommendations);
                logger.info('AI recommendations updated via real-time', 'BusinessScanService');
              }
            } catch (parseError) {
              logError(parseError, 'parsing real-time AI recommendations');
            }
          }
        }
      )
      .subscribe();

    return channel;
  }

  static getFallbackRecommendations = getFallbackRecommendations;
}
