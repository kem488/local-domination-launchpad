import { Button } from "@/components/ui/button";
import { TrialPopup } from "./TrialPopup";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { useScrollPosition, smoothScrollTo } from "@/hooks/useScrollPosition";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  const { scrollPosition } = useScrollPosition();
  const isScrolled = scrollPosition > 100;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            <img 
              src={logo} 
              alt="SyngularityLabs Logo"
              className={`hover:scale-105 transition-transform duration-300 cursor-pointer ${
                isScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'
              }`}
            />
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
            {user ? (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="btn-hover-effect touch-target"
                >
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="btn-hover-effect touch-target"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="btn-hover-effect touch-target"
                >
                  Sign In
                </Button>
                <TrialPopup>
                  <Button 
                    size="sm"
                    className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect touch-target px-4"
                  >
                    Lock £97
                  </Button>
                </TrialPopup>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <TrialPopup>
              <Button
                size="sm"
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target px-3 text-sm"
              >
                £97
              </Button>
            </TrialPopup>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};