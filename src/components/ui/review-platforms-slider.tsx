import React from 'react';
import { Card } from './card';

// Review platform logos - real logo URLs
const REVIEW_PLATFORMS = [
  { name: 'Google', logo: 'https://storage.googleapis.com/msgsndr/8eRvJowMThOa8MOenmMO/media/6867ef594f6d5cc9e640bade.png' },
  { name: 'Facebook', logo: 'https://storage.googleapis.com/msgsndr/8eRvJowMThOa8MOenmMO/media/6867ef596a45324273d78f36.png' },
  { name: 'Trustpilot', logo: 'https://storage.googleapis.com/msgsndr/8eRvJowMThOa8MOenmMO/media/6867ef590bbcf4cdca6bf2c2.png' },
  { name: 'Checkatrade', logo: 'https://storage.googleapis.com/msgsndr/8eRvJowMThOa8MOenmMO/media/6867ef5963f9ec6fcf5ca497.png' },
  { name: 'Which?', logo: 'https://storage.googleapis.com/msgsndr/8eRvJowMThOa8MOenmMO/media/6867ef590ea4e1c511b689e3.png' },
];

export const ReviewPlatformsSlider = () => {
  return (
    <div className="py-12 lg:py-16 bg-gradient-to-br from-muted/10 via-section-muted to-muted/20">
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="text-center mb-8 lg:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            We Monitor Reviews Across All Major Platforms
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Comprehensive coverage across the UK's most trusted review sites
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Enhanced Animated slider */}
          <div className="flex animate-[scroll_30s_linear_infinite] space-x-6 lg:space-x-8">
            {/* First set of logos */}
            {REVIEW_PLATFORMS.map((platform, index) => (
              <Card 
                key={`first-${index}`} 
                className="flex-shrink-0 p-6 lg:p-8 card-glass border-border/30 hover:border-primary/30 hover:bg-white/15 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center h-16 lg:h-20 w-32 lg:w-40">
                  <img 
                    src={platform.logo} 
                    alt={`${platform.name} reviews`}
                    className="max-h-10 lg:max-h-12 max-w-24 lg:max-w-32 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
              </Card>
            ))}
            {/* Duplicate set for seamless loop */}
            {REVIEW_PLATFORMS.map((platform, index) => (
              <Card 
                key={`second-${index}`} 
                className="flex-shrink-0 p-6 lg:p-8 card-glass border-border/30 hover:border-primary/30 hover:bg-white/15 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center h-16 lg:h-20 w-32 lg:w-40">
                  <img 
                    src={platform.logo} 
                    alt={`${platform.name} reviews`}
                    className="max-h-10 lg:max-h-12 max-w-24 lg:max-w-32 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};