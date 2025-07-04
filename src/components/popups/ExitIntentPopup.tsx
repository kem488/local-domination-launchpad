import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Gift, Search, TrendingUp, Target, Percent } from "lucide-react";
import { ConsultationPopup } from "../landing/ConsultationPopup";
import { CountdownTimer } from "../optimization/CountdownTimer";
import { trackConversion } from "@/hooks/useABTesting";

const POPUP_VARIANTS = [
  {
    id: 'competitor-analysis',
    title: 'FREE Detailed Competitor Analysis',
    subtitle: 'See exactly what your competitors are doing that you\'re not',
    description: 'Discover the hidden strategies your competitors use to dominate local search and steal your customers.',
    benefits: [
      'Complete breakdown of top 3 competitor strategies',
      'Exact keywords they rank for that you don\'t',
      'Their review generation tactics exposed',
      'Action plan to outrank them in 30 days'
    ],
    cta: 'Get My Competitor Analysis',
    icon: Search,
    urgency: 'Only 10 reports available this week'
  },
  {
    id: 'gbp-optimization',
    title: 'FREE In-Depth GBP Optimization Report',
    subtitle: 'Professional audit of your Google Business Profile',
    description: 'Get a comprehensive 15-point audit revealing exactly why you\'re not showing up in local searches.',
    benefits: [
      '15-point Google Business Profile scorecard',
      'Missing optimization opportunities identified',
      'Photo and content improvement recommendations',
      'Step-by-step optimization checklist'
    ],
    cta: 'Get My GBP Report',
    icon: TrendingUp,
    urgency: 'Limited to 15 reports this month'
  },
  {
    id: 'local-seo-audit',
    title: 'FREE Local SEO Audit & Action Plan',
    subtitle: 'Complete review of your local search presence',
    description: 'Uncover the exact reasons you\'re losing leads to competitors and get a personalized action plan.',
    benefits: [
      'Complete local SEO health check',
      'Citation and directory analysis',
      'Review strategy assessment',
      'Priority action plan with timelines'
    ],
    cta: 'Get My SEO Audit',
    icon: Target,
    urgency: 'Only available until end of month'
  },
  {
    id: 'last-chance-discount',
    title: 'FINAL CHANCE: Extra 20% Off',
    subtitle: 'Limited time bonus discount before you leave',
    description: 'Stack this exclusive 20% discount on top of your locked £97 rate - bringing it down to just £77.60/month for the first 6 months.',
    benefits: [
      'Extra 20% off your first 6 months (£77.60/month)',
      'Still keeps your £97/month rate locked forever',
      'Total savings: £117 in first 6 months',
      'Valid only for next 10 minutes'
    ],
    cta: 'Claim 20% Bonus Discount',
    icon: Percent,
    urgency: 'This offer expires in 10 minutes'
  }
];

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [variant, setVariant] = useState(POPUP_VARIANTS[0]);
  const [showLastChance, setShowLastChance] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const handleExitConversion = (action: string) => {
    trackConversion('exit_intent_conversion', 'popup', { 
      variant: variant.id,
      action 
    });
  };

  // Check if user has seen popup recently (24-48 hour cooldown)
  const hasRecentlySeenPopup = () => {
    const lastShown = localStorage.getItem('exitPopupLastShown');
    if (!lastShown) return false;
    
    const hoursSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
    return hoursSinceLastShown < 24; // 24 hour cooldown
  };

  useEffect(() => {
    // Track time on site
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setTimeOnSite((Date.now() - startTime) / 1000);
    }, 1000);

    // Track scroll percentage
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercentage((scrolled / maxScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Select variant once on mount
    const showDiscount = Math.random() < 0.4; // Reduced from 60% to 40%
    const randomVariant = showDiscount 
      ? POPUP_VARIANTS.find(v => v.id === 'last-chance-discount')!
      : POPUP_VARIANTS[Math.floor(Math.random() * (POPUP_VARIANTS.length - 1))];
    
    setVariant(randomVariant);
    setShowLastChance(randomVariant.id === 'last-chance-discount');
  }, []);

  useEffect(() => {
    // More restrictive conditions for showing popup
    const canShowPopup = () => {
      return (
        !hasShown &&
        !hasRecentlySeenPopup() &&
        timeOnSite >= 45 && // Minimum 45 seconds on site
        scrollPercentage >= 30 // Must scroll past 30% of page
      );
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect fast movement to top (escape velocity)
      const isEscapeVelocity = e.clientY <= 0 && e.movementY < -50;
      
      // Don't show popup if chat widget is open
      const chatWidget = document.querySelector('[data-chat-widget="true"]');
      const isChatOpen = chatWidget?.getAttribute('data-chat-open') === 'true';
      
      if (isEscapeVelocity && canShowPopup() && !isChatOpen) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitPopupLastShown', Date.now().toString());
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, timeOnSite, scrollPercentage]);

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
          <div className="flex items-center justify-center mb-4">
            <variant.icon className="h-8 w-8 text-brand-orange mr-3" />
            <div className="text-left">
              <h3 className="text-2xl font-bold text-primary">{variant.title}</h3>
              <p className="text-muted-foreground">{variant.subtitle}</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 rounded-lg border">
            <p className="text-muted-foreground mb-4">{variant.description}</p>
            
            <div className="space-y-2 mb-4">
              {variant.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-left">
                  <div className="w-2 h-2 bg-brand-orange rounded-full mt-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-brand-orange" />
              <span className="text-sm font-medium text-brand-orange">{variant.urgency}</span>
            </div>

            {showLastChance && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <CountdownTimer 
                  targetDate={new Date(Date.now() + 10 * 60 * 1000)} 
                  className="justify-center text-destructive"
                  showDays={false}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              {showLastChance ? (
                <ConsultationPopup>
                  <Button 
                    onClick={() => handleExitConversion('discount_claim')}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full animate-pulse"
                  >
                    {variant.cta}
                  </Button>
                </ConsultationPopup>
              ) : (
                <Button 
                  onClick={() => {
                    handleExitConversion('scan_request');
                    setIsOpen(false);
                    document.getElementById('business-scan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground w-full"
                >
                  {variant.cta}
                </Button>
              )}
              
              {!showLastChance && (
                <ConsultationPopup>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExitConversion('trial_start')}
                  >
                    Or Request Free Consultation
                  </Button>
                </ConsultationPopup>
              )}
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