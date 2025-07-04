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
import { LiveNotifications } from "@/components/ui/live-notifications";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ExitIntentPopup } from "@/components/popups/ExitIntentPopup";
import { SocialProofPopups } from "@/components/optimization/SocialProofPopups";
import { StickyMobileCTA } from "@/components/ui/sticky-mobile-cta";
import { ReviewPlatformsSlider } from "@/components/ui/review-platforms-slider";
import { useConversionTracking } from "@/hooks/useConversionTracking";

const Index = () => {
  // Initialize conversion tracking
  useConversionTracking();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-brand-blue">
          <Hero />
        </section>
        
        {/* Business Scan Section */}
        <section className="bg-section-light py-16">
          <BusinessScanSection />
        </section>
        
        {/* Review Platforms Slider */}
        <ReviewPlatformsSlider />
        
        {/* Who We Help Section */}
        <section className="bg-section-muted py-16">
          <WhoWeHelp />
        </section>
        
        {/* Strategy Section */}
        <section id="how-it-works" className="bg-background py-16">
          <Strategy />
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="bg-section-accent py-16">
          <Pricing />
        </section>
        
        {/* System Overview */}
        <section className="bg-background py-16">
          <SystemOverview />
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="bg-section-muted py-16">
          <FAQ />
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-brand-blue-light py-16">
          <CTA />
        </section>
      </main>
      <Footer />
      <LiveNotifications />
      <ChatWidget />
      <ExitIntentPopup />
      <SocialProofPopups />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
