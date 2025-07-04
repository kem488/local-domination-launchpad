import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { smoothScrollTo } from "@/hooks/useScrollPosition";
import { TrialPopup } from "@/components/landing/TrialPopup";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden touch-target p-2"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="touch-target p-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="py-4 space-y-2">
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors touch-target"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors touch-target"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors touch-target"
              >
                FAQ
              </button>
            </div>

            {/* User Actions */}
            <div className="border-t border-border p-4 space-y-3">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="w-full justify-start touch-target"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start touch-target"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="w-full touch-target"
                >
                  Sign In
                </Button>
              )}
            </div>
          </nav>

          {/* CTA Button */}
          <div className="p-4 border-t border-border">
            <TrialPopup>
              <Button
                size="lg"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target"
                onClick={() => setIsOpen(false)}
              >
                Lock £97/Month Rate
              </Button>
            </TrialPopup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};