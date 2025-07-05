import { Button } from "@/components/ui/button";
import { ConsultationPopup } from "./ConsultationPopup";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { useScrollPosition, smoothScrollTo } from "@/hooks/useScrollPosition";
export const Header = () => {
  const {
    scrollPosition
  } = useScrollPosition();
  const isScrolled = scrollPosition > 100;
  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-gradient-card/95 backdrop-blur-xl border-b border-border/50 shadow-medium py-2' : 'bg-gradient-glass backdrop-blur-lg border-b border-white/10 py-3'}`}>
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex items-center justify-between min-h-[64px]">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <h1 className={`font-black bg-gradient-to-r from-brand-blue via-primary to-brand-orange bg-clip-text text-transparent hover:scale-105 transition-all duration-300 cursor-pointer tracking-tight drop-shadow-sm ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
              5-Star Digital
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button onClick={() => handleNavClick('how-it-works')} className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 touch-target border border-transparent hover:border-primary/20 text-slate-700 bg-slate-200 hover:bg-slate-100 mx-[17px]">
              How It Works
            </button>
            <button onClick={() => handleNavClick('pricing')} className="text-foreground/80 hover:text-primary px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 touch-target border border-transparent hover:border-primary/20 bg-slate-200 hover:bg-slate-100">
              Pricing
            </button>
            <button onClick={() => handleNavClick('faq')} className="text-foreground/80 hover:text-primary py-2.5 rounded-lg text-sm font-medium transition-all duration-300 touch-target border border-transparent hover:border-primary/20 bg-slate-200 hover:bg-slate-100 px-[22px] mx-[20px]">
              FAQ
            </button>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ConsultationPopup>
              <Button variant="premium" size="sm" className="btn-hover-effect touch-target px-6 py-2.5 text-sm font-semibold shadow-medium mx-[10px]">
                Get Free Scan
              </Button>
            </ConsultationPopup>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-3">
            <ConsultationPopup>
              <Button variant="premium" size="sm" className="touch-target px-4 py-2 text-sm font-semibold shadow-soft">
                Scan
              </Button>
            </ConsultationPopup>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>;
};