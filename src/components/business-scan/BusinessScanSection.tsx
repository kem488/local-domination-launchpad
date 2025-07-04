import { Card } from "@/components/ui/card";
import { ScanForm } from "./ScanForm";
import { ScanProgress } from "./ScanProgress";
import { ScanResults } from "./ScanResults";
import { LeadGate } from "./LeadGate";
import { ScanHeader } from "./ScanHeader";
import { TrustIndicators } from "./TrustIndicators";
import { ScanSuccess } from "./ScanSuccess";
import { useBusinessScan } from "@/hooks/useBusinessScan";

export interface ScanData {
  scanId: string;
  scores: {
    overall: number;
    reviews: number;
    engagement: number;
    photos: number;
    completeness: number;
  };
  placeDetails: {
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    hasPhotos: boolean;
    hasWebsite: boolean;
    hasPhone: boolean;
    hasHours: boolean;
  };
}

export const BusinessScanSection = () => {
  const {
    scanState,
    scanData,
    progress,
    handleScanStart,
    handleLeadCaptured,
    handleViewFullReport
  } = useBusinessScan();


  return (
    <section id="business-scan" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <ScanHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {scanState === 'form' ? (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card border-border shadow-lg">
                <ScanForm onScanStart={handleScanStart} />
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card border-border shadow-lg">
                {scanState === 'scanning' && (
                  <ScanProgress progress={progress} />
                )}
                
                {scanState === 'results' && scanData && (
                  <ScanResults 
                    scanData={scanData} 
                    onViewFullReport={handleViewFullReport}
                  />
                )}
                
                {scanState === 'leadgate' && scanData && (
                  <LeadGate 
                    scanData={scanData}
                    onLeadCaptured={handleLeadCaptured}
                  />
                )}
                
                {scanState === 'success' && (
                  <ScanSuccess />
                )}
              </Card>
            </div>
          )}
        </div>

        <TrustIndicators />
      </div>
    </section>
  );
};