import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { BusinessScanSection } from "@/components/business-scan/BusinessScanSection";
import { WhoWeHelp } from "@/components/landing/WhoWeHelp";
import { Strategy } from "@/components/landing/Strategy";
import { Pricing } from "@/components/landing/Pricing";
import { SystemOverview } from "@/components/landing/SystemOverview";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ExitIntentPopup } from "@/components/popups/ExitIntentPopup";
import { RealScanActivity } from "@/components/ui/real-scan-activity";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";
import { ReviewPlatformsSlider } from "@/components/ui/review-platforms-slider";
import { SEOOptimizer } from "@/components/optimization/SEOOptimizer";
import { useConversionTracking } from "@/hooks/useConversionTracking";

const Index = () => {
  // Initialize conversion tracking
  useConversionTracking();
  
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Optimization */}
      <SEOOptimizer />
      
      <Header />
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-brand-blue" aria-label="Hero section">
          <Hero />
        </section>
        
        {/* Business Scan Section */}
        <section id="business-scan" className="bg-section-light py-16" aria-label="Business profile audit tool">
          <BusinessScanSection />
        </section>
        
        {/* Review Platforms Slider */}
        <ReviewPlatformsSlider />
        
        {/* Who We Help Section */}
        <section className="bg-section-muted py-16" aria-label="What our audit reveals">
          <WhoWeHelp />
        </section>
        
        {/* Strategy Section */}
        <section id="how-it-works" className="bg-background py-16" aria-label="How our audit works">
          <Strategy />
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="bg-section-accent py-16" aria-label="Pricing and packages">
          <Pricing />
        </section>
        
        {/* System Overview */}
        <section className="bg-background py-16" aria-label="System overview and guarantees">
          <SystemOverview />
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="bg-section-muted py-16" aria-label="Frequently asked questions">
          <FAQ />
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-brand-blue-light py-16" aria-label="Final call to action">
          <CTA />
        </section>
      </main>
      <Footer />
      <ChatWidget />
      <ExitIntentPopup />
      <RealScanActivity />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
