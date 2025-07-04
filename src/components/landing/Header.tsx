import { Button } from "@/components/ui/button";
import { ConsultationPopup } from "./ConsultationPopup";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { useScrollPosition, smoothScrollTo } from "@/hooks/useScrollPosition";

export const Header = () => {
  const { scrollPosition } = useScrollPosition();
  const isScrolled = scrollPosition > 100;

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/98 backdrop-blur-md border-b border-border shadow-sm py-1' 
        : 'bg-background/95 backdrop-blur-sm border-b border-border py-2'
    }`}>
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex items-center justify-between min-h-[60px]">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <h1 className={`font-black bg-gradient-to-r from-brand-blue via-primary to-brand-orange bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer tracking-tight ${
              isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
            }`}>
              SyngularityLabs
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors touch-target"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors touch-target"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavClick('faq')}
              className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors touch-target"
            >
              FAQ
            </button>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ConsultationPopup>
              <Button 
                size="sm"
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect touch-target px-4"
              >
                Get Free Scan
              </Button>
            </ConsultationPopup>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <ConsultationPopup>
              <Button
                size="sm"
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target px-3 text-sm"
              >
                Scan
              </Button>
            </ConsultationPopup>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};