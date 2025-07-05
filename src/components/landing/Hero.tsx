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
  return <div className="min-h-svh w-screen bg-gradient-to-br from-[#000] via-[#1A2428] to-[#0A1015] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Image with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Hero background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      <div className="w-full max-w-6xl space-y-12 lg:space-y-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12">
          
          <div className="space-y-6 lg:space-y-8 flex items-center justify-center flex-col">
            <Badge variant="premium" className="mb-4 px-4 py-2 text-sm shadow-glow">
              Free Google Business Profile Audit
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight max-w-5xl text-center leading-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text">
              Is Your Google Business Profile Costing You Customers?
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 max-w-4xl text-center leading-relaxed font-light">
              Free AI-powered audit reveals exactly what's broken in your Google Business Profile and how to fix it. Built by local marketing veterans using proven optimization strategies.
            </p>
            
            {/* Enhanced Trust Signals - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 py-6 lg:py-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto min-h-[52px] shadow-soft hover:bg-white/15 transition-all duration-300">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-white/95">100% Free, No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto min-h-[52px] shadow-soft hover:bg-white/15 transition-all duration-300">
                <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-white/95">AI Analysis by Marketing Veterans</span>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto min-h-[52px] shadow-soft hover:bg-white/15 transition-all duration-300">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-brand-blue flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-white/95">Live Google Data Analysis</span>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto min-h-[52px] shadow-soft hover:bg-white/15 transition-all duration-300">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-white/95">Instant Plan in 30 Seconds</span>
              </div>
            </div>

            <div className="flex flex-col items-center pt-6 lg:pt-8 space-y-6">
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
                variant="premium"
                size="lg"
                className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-xl btn-hover-effect font-bold w-full sm:w-auto min-w-[300px] sm:min-w-[320px] shadow-strong"
              >
                Get My Free Profile Audit
              </Button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/80 hover:text-white text-sm sm:text-base underline underline-offset-4 transition-all duration-300 hover:underline-offset-8 font-medium"
              >
                See how it works
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="card-glass rounded-xl p-4 sm:p-6 min-h-[180px] sm:h-48 lg:h-52 flex flex-col justify-start items-start space-y-4 hover:bg-white/15 transition-all duration-500 hover:shadow-medium group hover:scale-105">
              <div className="p-3 rounded-lg bg-gradient-to-r from-white/20 to-white/10 shadow-soft group-hover:shadow-medium transition-all duration-300">
                <feature.icon size={24} className="text-white/90 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold leading-tight text-white/95">{feature.title}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-300 leading-relaxed group-hover:text-neutral-200 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute inset-0'>
        <Scene />
      </div>
    </div>;
};