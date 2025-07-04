import { Button } from "@/components/ui/button";
import { TrialPopup } from "./TrialPopup";
import { useScrollPosition, smoothScrollTo } from "@/hooks/useScrollPosition";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SyngularityLogo from "@/components/ui/syngularity-logo";

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
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2' 
        : 'bg-background/95 backdrop-blur-sm border-b border-border py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SyngularityLogo 
                size={isScrolled ? "sm" : "md"} 
                variant="light"
                animated={true}
                className="hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => handleNavClick('how-it-works')}
                className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => handleNavClick('pricing')}
                className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => handleNavClick('faq')}
                className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                FAQ
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="outline"
                  size={isScrolled ? "sm" : "sm"}
                  onClick={() => navigate('/dashboard')}
                  className={`hidden sm:inline-flex btn-hover-effect ${isScrolled ? 'text-xs' : ''}`}
                >
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  size={isScrolled ? "sm" : "sm"}
                  onClick={handleSignOut}
                  className={`btn-hover-effect ${isScrolled ? 'text-xs px-3' : ''}`}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline"
                  size={isScrolled ? "sm" : "sm"}
                  onClick={() => navigate('/auth')}
                  className={`hidden sm:inline-flex btn-hover-effect ${isScrolled ? 'text-xs' : ''}`}
                >
                  Sign In
                </Button>
                <TrialPopup>
                  <Button 
                    size={isScrolled ? "sm" : "sm"}
                    className={`bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground btn-hover-effect ${isScrolled ? 'text-xs px-3' : ''}`}
                  >
                    {isScrolled ? 'Lock £97' : 'Lock £97/Month'}
                  </Button>
                </TrialPopup>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};