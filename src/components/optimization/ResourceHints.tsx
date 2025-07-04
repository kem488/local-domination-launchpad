import { useEffect } from 'react';

export const ResourceHints = () => {
  useEffect(() => {
    const addResourceHint = (rel: string, href: string, as?: string) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.setAttribute('as', as);
      document.head.appendChild(link);
    };

    // DNS prefetch for external domains
    addResourceHint('dns-prefetch', 'https://fonts.googleapis.com');
    addResourceHint('dns-prefetch', 'https://fonts.gstatic.com');
    addResourceHint('dns-prefetch', 'https://images.unsplash.com');

    // Preconnect for critical external resources
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://fonts.gstatic.com');

    // Preload critical resources
    addResourceHint('preload', '/fonts/inter.woff2', 'font');
    
    // Module preload for critical JavaScript
    const modulePreloads = [
      '/src/main.tsx',
      '/src/App.tsx',
      '/src/pages/Index.tsx'
    ];

    modulePreloads.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = href;
      document.head.appendChild(link);
    });

  }, []);

  return null;
};