import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Cpu, ShieldCheck, Layers, Zap, Eye, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.png";
const features = [{
  icon: Eye,
  title: "Profile Optimization Report",
  description: "Our AI identifies exactly what's missing from your Google Business Profile and provides specific recommendations to improve your local search visibility."
}, {
  icon: ShieldCheck,
  title: "Local Search Improvement Plan",
  description: "Discover the ranking factors you're missing and get a step-by-step plan to optimize your profile for better Google Maps visibility."
}, {
  icon: Layers,
  title: "Review Strategy Blueprint",
  description: "Learn why customers aren't leaving reviews and get proven tactics to generate 25+ genuine reviews monthly."
}, {
  icon: Zap,
  title: "Customer Conversion Analysis",
  description: "Find out where you're losing potential customers in your profile and how to optimize for more phone calls and visits."
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
              Free Google Business Profile Audit
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-center leading-tight">
              Is Your Google Business Profile Costing You Customers?
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl text-center leading-relaxed">
              Free AI-powered audit reveals exactly what's broken in your Google Business Profile and how to fix it. Built by local marketing veterans using proven optimization strategies.
            </p>
            
            {/* Trust Signals - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 py-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 w-full sm:w-auto min-h-[44px]">
                <CheckCircle className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">100% Free, No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 w-full sm:w-auto min-h-[44px]">
                <Cpu className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">AI Analysis by Marketing Veterans</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 w-full sm:w-auto min-h-[44px]">
                <Layers className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">Live Google Data Analysis</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 w-full sm:w-auto min-h-[44px]">
                <Zap className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span className="text-sm font-medium text-white/90">Instant Plan in 30 Seconds</span>
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
                Get My Free Profile Audit
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

        {/* Mobile-Optimized Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 min-h-[160px] sm:h-40 md:h-48 flex flex-col justify-start items-start space-y-3 hover:bg-white/10 transition-colors">
              <feature.icon size={20} className="text-white/80 md:w-6 md:h-6 flex-shrink-0" />
              <h3 className="text-sm md:text-base font-semibold leading-tight">{feature.title}</h3>
              <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute inset-0'>
        <Scene />
      </div>
    </div>;
};