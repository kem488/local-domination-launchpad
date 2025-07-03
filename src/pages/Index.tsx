import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhoWeHelp } from "@/components/landing/WhoWeHelp";
import { Strategy } from "@/components/landing/Strategy";
import { Pricing } from "@/components/landing/Pricing";
import { SystemOverview } from "@/components/landing/SystemOverview";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { LiveNotifications } from "@/components/ui/live-notifications";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />
        <WhoWeHelp />
        <section id="how-it-works">
          <Strategy />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <SystemOverview />
        <section id="faq">
          <FAQ />
        </section>
        <CTA />
      </main>
      <Footer />
      <LiveNotifications />
    </div>
  );
};

export default Index;
