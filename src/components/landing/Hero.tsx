import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Cpu, ShieldCheck, Layers, Zap, Eye } from "lucide-react";
import heroImage from "@/assets/hero-image.png";
const features = [{
  icon: Eye,
  title: "Profile Optimization Report",
  description: "We'll show you exactly what's missing from your Google Business Profile and how to fix it to get more calls."
}, {
  icon: ShieldCheck,
  title: "Local Search Visibility Plan",
  description: "Discover the key ranking factors and optimization opportunities to improve your Google Maps visibility."
}, {
  icon: Layers,
  title: "Review Generation System",
  description: "Learn proven strategies to generate more genuine reviews and improve your online reputation."
}, {
  icon: Zap,
  title: "Customer Conversion Analysis",
  description: "Find out where you're losing potential customers and how to optimize your profile to convert more visitors into calls."
}];
export const Hero = () => {
  return <div className="min-h-svh w-screen bg-linear-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Hero background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
      </div>

      <div className="w-full max-w-6xl space-y-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          
          <div className="space-y-6 flex items-center justify-center flex-col">
            <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 mb-4">
              Business Profile Audit
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-center leading-tight">
              Is Your Google Business Profile Costing You Customers?
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl text-center leading-relaxed">
              We'll analyze your Google Business Profile and reveal exactly what's holding you back 
              from getting more calls. Most local businesses are missing these crucial optimization 
              opportunities - is yours one of them?
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-6">
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">Google Partner Certified</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Eye className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">500+ Business Audits</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Zap className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">7+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Cpu className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">90-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Layers className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">Live Google Data</span>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4 space-y-4">
              <Button 
                onClick={() => {
                  const element = document.getElementById('business-scan');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="text-lg px-12 py-4 rounded-xl bg-brand-orange text-brand-orange-foreground border shadow-lg hover:bg-brand-orange/90 btn-hover-effect font-semibold w-full sm:w-auto min-w-[280px]"
              >
                Audit My Business Profile Now
              </Button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
              >
                See how it works
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => <div key={idx} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3">
              <feature.icon size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">{feature.title}</h3>
              <p className="text-xs md:text-sm text-neutral-400">{feature.description}</p>
            </div>)}
        </div>
      </div>
      <div className='absolute inset-0'>
        <Scene />
      </div>
    </div>;
};