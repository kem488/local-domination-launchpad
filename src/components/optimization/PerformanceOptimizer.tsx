import { useEffect, useCallback, useState } from 'react';
import { useErrorLogger } from '@/hooks/useErrorLogger';

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  renderCount: number;
}

export const PerformanceOptimizer = () => {
  const { logPerformance } = useErrorLogger();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    bundleSize: 0,
    loadTime: 0,
    memoryUsage: 0,
    renderCount: 0
  });

  // Bundle analyzer
  const analyzeBundleSize = useCallback(async () => {
    try {
      const entries = performance.getEntriesByType('resource');
      const jsResources = entries.filter(entry => 
        entry.name.endsWith('.js') || entry.name.endsWith('.tsx')
      );
      
      const totalSize = jsResources.reduce((acc, resource: any) => {
        return acc + (resource.transferSize || 0);
      }, 0);

      setMetrics(prev => ({ ...prev, bundleSize: totalSize }));
      
      logPerformance({
        metric: 'bundle_size',
        value: totalSize,
        unit: 'bytes',
        source: 'performance_optimizer'
      });

      // Alert if bundle is too large (>500KB)
      if (totalSize > 500000) {
        console.warn(`Large bundle detected: ${(totalSize / 1024).toFixed(2)}KB`);
      }
    } catch (error) {
      console.error('Bundle size analysis failed:', error);
    }
  }, [logPerformance]);

  // Memory usage monitoring
  const monitorMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize;
      
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      logPerformance({
        metric: 'memory_usage',
        value: memoryUsage,
        unit: 'bytes',
        source: 'performance_optimizer'
      });

      // Alert if memory usage is high (>50MB)
      if (memoryUsage > 50 * 1024 * 1024) {
        console.warn(`High memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  }, [logPerformance]);

  // Image lazy loading optimization
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }, []);

  // Code splitting detection and optimization
  const optimizeCodeSplitting = useCallback(() => {
    // Monitor dynamic imports (if available)
    if ('import' in window && typeof (window as any).import === 'function') {
      const originalImport = (window as any).import;
      
      (window as any).import = async (specifier: string) => {
        const startTime = performance.now();
        
        try {
          const module = await originalImport(specifier);
          const loadTime = performance.now() - startTime;
          
          logPerformance({
            metric: 'dynamic_import_time',
            value: loadTime,
            unit: 'ms',
            source: 'performance_optimizer',
            metadata: { module: specifier }
          });
          
          return module;
        } catch (error) {
          console.error(`Failed to load module: ${specifier}`, error);
          throw error;
        }
      };
    }
  }, [logPerformance]);

  // Render performance tracking
  const trackRenderPerformance = useCallback(() => {
    let renderCount = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('render')) {
          renderCount++;
          setMetrics(prev => ({ ...prev, renderCount }));
          
          logPerformance({
            metric: 'render_time',
            value: entry.duration,
            unit: 'ms',
            source: 'performance_optimizer'
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }, [logPerformance]);

  // Resource prefetching
  const prefetchCriticalResources = useCallback(() => {
    const criticalResources = [
      '/api/business-scan',
      '/api/generate-recommendations'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    // Initialize all optimizations
    const initOptimizations = async () => {
      analyzeBundleSize();
      optimizeImages();
      optimizeCodeSplitting();
      trackRenderPerformance();
      prefetchCriticalResources();
      
      // Start periodic monitoring
      const memoryInterval = setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
      const bundleInterval = setInterval(analyzeBundleSize, 60000); // Every minute
      
      return () => {
        clearInterval(memoryInterval);
        clearInterval(bundleInterval);
      };
    };

    initOptimizations();
  }, [analyzeBundleSize, monitorMemoryUsage, optimizeImages, optimizeCodeSplitting, trackRenderPerformance, prefetchCriticalResources]);

  return null;
};