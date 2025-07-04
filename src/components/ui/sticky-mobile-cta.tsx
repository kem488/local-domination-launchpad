import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrialPopup } from "@/components/landing/TrialPopup";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { trackConversion } from "@/hooks/useABTesting";

export const StickyMobileCTA = () => {
  const { scrollPosition } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling 300px and hide near footer
    const showThreshold = 300;
    const hideThreshold = document.body.scrollHeight - window.innerHeight - 500;
    
    setIsVisible(scrollPosition > showThreshold && scrollPosition < hideThreshold);
  }, [scrollPosition]);

  const handleClick = () => {
    trackConversion('sticky_mobile_cta_click', 'mobile_cta', { position: 'sticky_bottom' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 safe-area-inset-bottom">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">Lock £97/Month Rate</div>
          <div className="text-xs text-muted-foreground truncate">Usually £247/month - Expires July 31st</div>
        </div>
        <TrialPopup>
          <Button
            size="sm"
            className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target px-6 font-semibold whitespace-nowrap"
            onClick={handleClick}
          >
            Start Trial
          </Button>
        </TrialPopup>
      </div>
    </div>
  );
};