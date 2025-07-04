import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Gift } from "lucide-react";
import { TrialPopup } from "../landing/TrialPopup";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Also trigger on scroll up attempt at top of page
    const handleScroll = () => {
      if (window.scrollY <= 100 && !hasShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
        }, 30000); // Show after 30 seconds if at top

        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Badge variant="destructive" className="mb-2">
              <Gift className="h-4 w-4 mr-1" />
              WAIT! Special Offer
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Don't Leave Empty-Handed!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4 pt-4">
          <div className="p-4 bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-brand-orange" />
              <span className="font-semibold text-lg">Limited Time Only</span>
            </div>
            <p className="text-muted-foreground mb-3">
              Get your business scanned for FREE and discover exactly why you're losing customers to competitors.
            </p>
            <div className="text-3xl font-bold text-primary mb-1">
              FREE Business Scan
            </div>
            <div className="text-sm text-muted-foreground line-through">
              Usually £47
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ✓ See your Google Business Profile score<br/>
              ✓ Get personalized improvement recommendations<br/>
              ✓ Discover hidden competitor advantages<br/>
              ✓ No obligation - completely free
            </p>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('business-scan')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground w-full"
              >
                Get My FREE Scan Now
              </Button>
              
              <TrialPopup>
                <Button variant="outline" className="w-full">
                  Or Start 14-Day Free Trial
                </Button>
              </TrialPopup>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              No thanks, I'll pass on this opportunity
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};