import { useEffect } from 'react';

interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
}

const CSP_DIRECTIVES: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React in development
    "'unsafe-eval'", // Required for React DevTools
    'https://www.googletagmanager.com',
    'https://connect.facebook.net',
    'https://www.google-analytics.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled components
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://images.unsplash.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  'connect-src': [
    "'self'",
    'https://edfloyhwqovslovzvkrm.supabase.co',
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://connect.facebook.net',
    'https://api.stripe.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com'
  ]
};

export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy
    const cspValue = Object.entries(CSP_DIRECTIVES)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');

    // Create meta tag for CSP (fallback method)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = cspValue;
    
    // Only add if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      document.head.appendChild(cspMeta);
    }

    // Set other security headers via meta tags
    const securityHeaders = [
      {
        httpEquiv: 'X-Content-Type-Options',
        content: 'nosniff'
      },
      {
        httpEquiv: 'X-Frame-Options',
        content: 'DENY'
      },
      {
        httpEquiv: 'X-XSS-Protection',
        content: '1; mode=block'
      },
      {
        httpEquiv: 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin'
      },
      {
        httpEquiv: 'Permissions-Policy',
        content: 'camera=(), microphone=(), geolocation=()'
      }
    ];

    securityHeaders.forEach(({ httpEquiv, content }) => {
      if (!document.querySelector(`meta[http-equiv="${httpEquiv}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = httpEquiv;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Log security headers status
    console.log('Security headers initialized:', {
      csp: 'enabled',
      xFrameOptions: 'DENY',
      contentTypeOptions: 'nosniff',
      xssProtection: 'enabled',
      referrerPolicy: 'strict-origin-when-cross-origin'
    });

  }, []);

  return null;
};