import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Cpu, ShieldCheck, Layers, Zap, Eye } from "lucide-react";
import heroImage from "@/assets/hero-image.png";
const features = [{
  icon: Eye,
  title: "Review Generation",
  description: "Automatically collect 25+ genuine reviews in 90 days."
}, {
  icon: ShieldCheck,
  title: "Local SEO Domination",
  description: "Outrank competitors in Google search results."
}, {
  icon: Layers,
  title: "GBP Optimization",
  description: "Complete Google Business Profile management."
}, {
  icon: Zap,
  title: "Lead Automation",
  description: "Never chase customers for reviews again."
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
              Transform Your Local Business in 90 Days
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-center leading-tight">
              Stop the Feast-or-Famine Cycle Forever
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl text-center leading-relaxed">
              Join 200+ UK tradespeople who've gone from "Google Who?" to local market leaders. 
              Get 25+ reviews, dominate local search, and never worry about leads again.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-6">
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">Google Partner</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Eye className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">500+ Businesses</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">GDPR Secure</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Cpu className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">90-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <Zap className="h-4 w-4 text-white/80" />
                <span className="text-sm font-medium text-white/90">30sec Analysis</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
              <Button 
                onClick={() => document.getElementById('business-scan')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-10 py-4 rounded-xl bg-brand-orange text-brand-orange-foreground border shadow-lg hover:bg-brand-orange/90 btn-hover-effect font-semibold"
              >
                Start Free Trial
              </Button>
              <Button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-10 py-4 rounded-xl bg-transparent text-white border border-white/20 shadow-lg hover:bg-white/10 btn-hover-effect"
              >
                See How It Works
              </Button>
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