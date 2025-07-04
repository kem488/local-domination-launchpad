import { useEffect } from 'react';

export const CriticalCSS = () => {
  useEffect(() => {
    // Inline critical CSS for above-the-fold content
    const criticalStyles = `
      /* Critical styles for hero section and header */
      .hero-section {
        min-height: 100vh;
        background: hsl(var(--background));
      }
      
      .header-nav {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 50;
        background: hsl(var(--background) / 0.95);
        backdrop-filter: blur(10px);
      }

      /* Prevent layout shift for images */
      img {
        height: auto;
        max-width: 100%;
      }

      /* Optimize font loading */
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }

      /* Critical button styles */
      .btn-primary {
        background: hsl(var(--brand-orange));
        color: hsl(var(--brand-orange-foreground));
        border: none;
        border-radius: 0.5rem;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .btn-primary:hover {
        background: hsl(var(--brand-orange) / 0.9);
        transform: translateY(-1px);
      }

      /* Skeleton loader for images */
      .skeleton {
        background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted) / 0.5) 50%, hsl(var(--muted)) 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }

      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;

    // Create and inject critical CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = criticalStyles;
    styleElement.setAttribute('data-critical-css', '');
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup critical CSS when component unmounts
      const criticalStyleElements = document.querySelectorAll('[data-critical-css]');
      criticalStyleElements.forEach(el => el.remove());
    };
  }, []);

  return null;
};