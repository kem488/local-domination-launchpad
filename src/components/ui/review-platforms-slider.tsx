import React from 'react';
import { Card } from './card';

// Review platform logos - using placeholder image URLs that will show platform logos
const REVIEW_PLATFORMS = [
  { name: 'Google', logo: '/api/placeholder/120/60?text=Google' },
  { name: 'Facebook', logo: '/api/placeholder/120/60?text=Facebook' },
  { name: 'Trustpilot', logo: '/api/placeholder/120/60?text=Trustpilot' },
  { name: 'Yelp', logo: '/api/placeholder/120/60?text=Yelp' },
  { name: 'Checkatrade', logo: '/api/placeholder/120/60?text=Checkatrade' },
  { name: 'MyBuilder', logo: '/api/placeholder/120/60?text=MyBuilder' },
  { name: 'Rated People', logo: '/api/placeholder/120/60?text=RatedPeople' },
  { name: 'Which?', logo: '/api/placeholder/120/60?text=Which' },
];

export const ReviewPlatformsSlider = () => {
  return (
    <div className="py-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            We Monitor Reviews Across All Major Platforms
          </h3>
          <p className="text-muted-foreground">
            Comprehensive coverage across the UK's most trusted review sites
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Animated slider */}
          <div className="flex animate-[scroll_30s_linear_infinite] space-x-8">
            {/* First set of logos */}
            {REVIEW_PLATFORMS.map((platform, index) => (
              <Card 
                key={`first-${index}`} 
                className="flex-shrink-0 p-6 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16 w-32">
                  <img 
                    src={platform.logo} 
                    alt={`${platform.name} reviews`}
                    className="max-h-10 max-w-24 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </Card>
            ))}
            {/* Duplicate set for seamless loop */}
            {REVIEW_PLATFORMS.map((platform, index) => (
              <Card 
                key={`second-${index}`} 
                className="flex-shrink-0 p-6 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16 w-32">
                  <img 
                    src={platform.logo} 
                    alt={`${platform.name} reviews`}
                    className="max-h-10 max-w-24 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
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