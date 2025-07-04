import { useEffect, useRef } from 'react';
import { trackEngagement } from './useABTesting';

export const useScrollTracking = () => {
  const trackedSections = useRef(new Set<string>());
  const scrollDepths = useRef(new Set<number>());
  const startTime = useRef(Date.now());

  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
      
      // Track scroll depth milestones
      const depthMilestones = [25, 50, 75, 90, 100];
      depthMilestones.forEach(depth => {
        if (scrollPercentage >= depth && !scrollDepths.current.has(depth)) {
          scrollDepths.current.add(depth);
          trackEngagement('scroll_depth', 'page', depth);
        }
      });

      // Track max scroll
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
      }

      // Track section visibility
      const sections = [
        'hero',
        'business-scan', 
        'who-we-help',
        'how-it-works',
        'pricing',
        'system-overview',
        'faq'
      ];

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element && !trackedSections.current.has(sectionId)) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
          
          if (isVisible) {
            trackedSections.current.add(sectionId);
            trackEngagement('section_view', sectionId);
          }
        }
      });
    };

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      trackEngagement('time_on_page', 'page', timeOnPage);
      trackEngagement('max_scroll_depth', 'page', maxScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export const useElementTracking = (elementRef: React.RefObject<HTMLElement>, eventName: string, elementId: string) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleClick = (e: Event) => {
      trackEngagement(eventName, elementId);
    };

    const handleMouseEnter = () => {
      trackEngagement('hover', elementId);
    };

    element.addEventListener('click', handleClick);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [elementRef, eventName, elementId]);
};