import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConsultationPopup } from "@/components/landing/ConsultationPopup";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { trackConversion } from "@/hooks/useABTesting";

export const StickyMobileCTA = () => {
  const { scrollPosition } = useScrollPosition();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling 100px for faster engagement
    const showThreshold = 100;
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
          <div className="text-sm font-semibold text-foreground">Free Business Consultation</div>
          <div className="text-xs text-muted-foreground truncate">Expert analysis & growth strategy</div>
        </div>
        <ConsultationPopup>
          <Button
            size="sm"
            className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground touch-target px-6 font-semibold whitespace-nowrap"
            onClick={handleClick}
          >
            Get Consultation
          </Button>
        </ConsultationPopup>
      </div>
    </div>
  );
};