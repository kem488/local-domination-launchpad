import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhoWeHelp } from "@/components/landing/WhoWeHelp";
import { Strategy } from "@/components/landing/Strategy";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhoWeHelp />
      <Strategy />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
