import React from 'react';

interface SyngularityLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const SyngularityLogo: React.FC<SyngularityLogoProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-3xl'
  };

  const textColor = variant === 'light' ? 'text-foreground' : 'text-primary-foreground';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))' }}
        >
          <defs>
            <linearGradient id="sGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--brand-blue))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--brand-orange))" />
              <stop offset="100%" stopColor="hsl(var(--brand-blue))" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Orbital Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="2"
            opacity="0.6"
            className={animated ? 'animate-spin' : ''}
            style={{ 
              transformOrigin: '50px 50px',
              animationDuration: '8s',
              animationTimingFunction: 'linear'
            }}
          />
          
          {/* Inner Ring */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="1"
            opacity="0.3"
            className={animated ? 'animate-spin' : ''}
            style={{ 
              transformOrigin: '50px 50px',
              animationDuration: '12s',
              animationTimingFunction: 'linear',
              animationDirection: 'reverse'
            }}
          />
          
          {/* 3D S Letter */}
          <g filter="url(#shadow)">
            {/* Back layer for 3D effect */}
            <path
              d="M35 25 C25 25, 20 30, 20 35 C20 40, 25 42, 30 42 L45 42 C50 42, 52 45, 52 48 C52 52, 48 55, 45 55 L30 55 C28 55, 26 56, 26 58 C26 60, 28 61, 30 61 L45 61 C55 61, 62 55, 62 48 C62 40, 55 36, 50 36 L35 36 C30 36, 28 33, 28 30 C28 26, 32 23, 35 23 L50 23 C52 23, 54 22, 54 20 C54 18, 52 17, 50 17 L35 17 C25 17, 15 22, 15 30 C15 38, 22 42, 30 42"
              fill="hsl(var(--muted-foreground))"
              transform="translate(2, 2)"
              opacity="0.4"
            />
            
            {/* Main S letter */}
            <path
              d="M35 25 C25 25, 20 30, 20 35 C20 40, 25 42, 30 42 L45 42 C50 42, 52 45, 52 48 C52 52, 48 55, 45 55 L30 55 C28 55, 26 56, 26 58 C26 60, 28 61, 30 61 L45 61 C55 61, 62 55, 62 48 C62 40, 55 36, 50 36 L35 36 C30 36, 28 33, 28 30 C28 26, 32 23, 35 23 L50 23 C52 23, 54 22, 54 20 C54 18, 52 17, 50 17 L35 17 C25 17, 15 22, 15 30 C15 38, 22 42, 30 42"
              fill="url(#sGradient)"
            />
            
            {/* Highlight for 3D effect */}
            <path
              d="M35 25 C30 25, 28 27, 28 30 C28 32, 29 33, 31 33 L35 33 C40 33, 42 35, 42 38 C42 40, 40 42, 38 42 L32 42"
              fill="hsl(var(--brand-orange))"
              opacity="0.6"
              strokeWidth="1"
              stroke="hsl(var(--brand-orange))"
            />
          </g>
          
          {/* Accent dots */}
          <circle cx="75" cy="25" r="2" fill="hsl(var(--brand-orange))" opacity="0.8" className={animated ? 'animate-ping' : ''} />
          <circle cx="25" cy="75" r="1.5" fill="hsl(var(--primary))" opacity="0.6" className={animated ? 'animate-ping' : ''} style={{ animationDelay: '1s' }} />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span 
            className={`font-bold tracking-[0.2em] ${textSizeClasses[size]} ${textColor} leading-tight`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            SYNGULARITY
          </span>
          <span 
            className={`font-medium tracking-[0.15em] ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-xl'} ${textColor} opacity-80`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            LABS
          </span>
        </div>
      )}
    </div>
  );
};

export default SyngularityLogo;