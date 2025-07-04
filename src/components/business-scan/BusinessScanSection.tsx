import { Card } from "@/components/ui/card";
import { ScanForm } from "./ScanForm";
import { ScanProgress } from "./ScanProgress";
import { ScanResults } from "./ScanResults";
import { LeadGate } from "./LeadGate";
import { ScanHeader } from "./ScanHeader";
import { TrustIndicators } from "./TrustIndicators";
import { ScanSuccess } from "./ScanSuccess";
import { useBusinessScan } from "@/hooks/useBusinessScan";
import businessScanDemo from "@/assets/business-scan-demo.png";

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
    handleLeadCaptured
  } = useBusinessScan();

  // Unused function - kept for compatibility but no longer used
  const handleViewFullReport = () => {
    console.log('handleViewFullReport called - deprecated, ScanResults handles trial signup directly');
  };

  return (
    <section id="business-scan" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <ScanHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {scanState === 'form' ? (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Image */}
              <div className="hidden lg:block">
                <div className="relative">
                  <img 
                    src={businessScanDemo} 
                    alt="Business Scan Demo"
                    className="w-full h-auto rounded-xl shadow-lg animate-fade-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl"></div>
                </div>
              </div>

              {/* Right side - Form */}
              <div>
                <Card className="p-8 bg-card border-border shadow-lg">
                  <ScanForm onScanStart={handleScanStart} />
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card border-border shadow-lg">
                {scanState === 'scanning' && (
                  <ScanProgress progress={progress} />
                )}
                
                {scanState === 'trial-signup' && scanData && (
                  <LeadGate 
                    scanData={scanData}
                    onLeadCaptured={handleLeadCaptured}
                  />
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
                
                {scanState === 'report' && (
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