import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Gift, Search, TrendingUp, Target } from "lucide-react";
import { TrialPopup } from "../landing/TrialPopup";

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
  }
];

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [variant, setVariant] = useState(POPUP_VARIANTS[0]);

  useEffect(() => {
    // Random A/B test variant selection
    const randomVariant = POPUP_VARIANTS[Math.floor(Math.random() * POPUP_VARIANTS.length)];
    setVariant(randomVariant);
    
    // Track which variant was shown for analytics
    console.log('Exit popup variant:', randomVariant.id);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Don't show popup if chat widget is open
      const chatWidget = document.querySelector('[data-chat-widget="true"]');
      const isChatOpen = chatWidget?.getAttribute('data-chat-open') === 'true';
      
      if (e.clientY <= 0 && !hasShown && !isChatOpen) {
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
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('business-scan')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground w-full"
              >
                {variant.cta}
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