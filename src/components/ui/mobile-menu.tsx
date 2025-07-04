import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { smoothScrollTo } from "@/hooks/useScrollPosition";
import { ConsultationPopup } from "@/components/landing/ConsultationPopup";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
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
          </nav>

          {/* CTA Button */}
          <div className="p-4 border-t border-border">
            <ConsultationPopup>
              <Button
                size="lg"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target"
                onClick={() => setIsOpen(false)}
              >
                Get Free Business Scan
              </Button>
            </ConsultationPopup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};