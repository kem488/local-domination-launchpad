import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanForm } from "./ScanForm";
import { ScanProgress } from "./ScanProgress";
import { ScanResults } from "./ScanResults";
import { LeadGate } from "./LeadGate";
import { CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

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

type ScanState = 'form' | 'scanning' | 'results' | 'leadgate' | 'report';

export const BusinessScanSection = () => {
  const [scanState, setScanState] = useState<ScanState>('form');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScanStart = async (businessName: string, businessLocation: string) => {
    setScanState('scanning');
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
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
        setTimeout(() => setScanState('results'), 500);
      } else {
        throw new Error(result.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setProgress(0);
      setScanState('form');
      // Show user-friendly error message
      alert('Sorry, we couldn\'t scan your business at the moment. Please try again or contact support if the issue persists.');
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleViewFullReport = () => {
    setScanState('leadgate');
  };

  const handleLeadCaptured = () => {
    setScanState('report');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6 bg-brand-blue-light text-brand-blue border-brand-blue/20">
            Free Business Intelligence Tool
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Get Your Free
            <span className="text-primary block">Google Business Health Check</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover exactly why your competitors are getting more customers. Our AI-powered scan analyzes your Google Business Profile and reveals hidden opportunities in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>100% Free, No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>500+ Businesses Analyzed This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Live Google Data Analysis</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card border-border shadow-lg">
            {scanState === 'form' && (
              <ScanForm onScanStart={handleScanStart} />
            )}
            
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
            
            {scanState === 'report' && scanData && (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Report Sent Successfully!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Check your email for your detailed business analysis and personalized recommendations.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-brand-blue mb-2">500+</div>
              <div className="text-muted-foreground">Businesses Scanned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-blue mb-2">4.9/5</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-blue mb-2">30s</div>
              <div className="text-muted-foreground">Scan Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-blue mb-2">100%</div>
              <div className="text-muted-foreground">Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};