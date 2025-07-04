import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanForm } from "./ScanForm";
import { ScanProgress } from "./ScanProgress";
import { ScanResults } from "./ScanResults";
import { LeadGate } from "./LeadGate";
import { EmailCapture } from "./EmailCapture";
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

type ScanState = 'form' | 'scanning' | 'results' | 'trial-signup' | 'leadgate' | 'report';

export const BusinessScanSection = () => {
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

  const handleViewFullReport = () => {
    setScanState('leadgate');
  };

  const handleFixThisForMe = async (email: string) => {
    // Store email in database and proceed to trial signup
    try {
      const response = await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId: scanData?.scanId,
          email,
          source: 'fix-this-for-me'
        })
      });

      if (response.ok) {
        setScanState('trial-signup');
      }
    } catch (error) {
      console.error('Error capturing lead:', error);
      throw error;
    }
  };

  const handleGetFreeReport = async (email: string) => {
    // Store email and send report
    try {
      const response = await fetch('https://edfloyhwqovslovzvkrm.supabase.co/functions/v1/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId: scanData?.scanId,
          email,
          source: 'free-report'
        })
      });

      if (response.ok) {
        setScanState('report');
      }
    } catch (error) {
      console.error('Error capturing lead:', error);
      throw error;
    }
  };

  const handleLeadCaptured = () => {
    setScanState('report');
  };

  return (
    <section id="business-scan" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
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