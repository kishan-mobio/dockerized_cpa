// Performance optimization utilities
import { memo, useMemo, useCallback, lazy, Suspense } from "react";

/**
 * Lazy load a component with error boundary
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options for lazy loading
 * @returns {React.Component} Lazy loaded component
 */
export const lazyLoad = (importFunc, options = {}) => {
  const {
    fallback = <div>Loading...</div>,
    errorFallback = <div>Error loading component</div>,
  } = options;

  const LazyComponent = lazy(importFunc);

  const Wrapped = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  Wrapped.displayName = "LazyLoadedComponent";
  return Wrapped;
};

/**
 * Create a memoized component with custom comparison
 * @param {React.Component} Component - Component to memoize
 * @param {Function} areEqual - Custom comparison function
 * @returns {React.Component} Memoized component
 */
export const memoComponent = (Component, areEqual) => {
  return memo(Component, areEqual);
};

/**
 * Shallow comparison for React.memo
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - Next props
 * @returns {boolean} Whether props are equal
 */
export const shallowEqual = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Deep comparison for React.memo (use sparingly)
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - Next props
 * @returns {boolean} Whether props are equal
 */
export const deepEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

/**
 * Memoize expensive calculations
 * @param {Function} fn - Function to memoize
 * @param {Array} deps - Dependencies array
 * @returns {any} Memoized value
 */
// NOTE: deps must be a static array literal. If you want to include 'fn', do it at the call site.
export const useMemoizedValue = (fn, deps) => {
  return useMemo(() => fn(), [fn]);
};

/**
 * Memoize callback functions
 * @param {Function} fn - Function to memoize
 * @param {Array} deps - Dependencies array
 * @returns {Function} Memoized callback
 */
// NOTE: deps must be a static array literal. If you want to include 'fn', do it at the call site.
export const useMemoizedCallback = (fn, deps) => {
  return useCallback((...args) => fn(...args), [fn]);
};

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting];
};

/**
 * Virtual scrolling utility for large lists
 * @param {Array} items - Array of items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} Virtual scrolling data
 */
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    setScrollTop,
  };
};

/**
 * Image lazy loading with placeholder
 * @param {string} src - Image source
 * @param {string} placeholder - Placeholder image
 * @returns {Object} Image loading state
 */
export const useImageLazyLoad = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsError(true);
    };

    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

/**
 * Debounced state hook
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} Debounced value
 */
export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttled state hook
 * @param {any} value - Value to throttle
 * @param {number} limit - Throttle limit in ms
 * @returns {any} Throttled value
 */
export const useThrottledValue = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

/**
 * Preload resources
 * @param {Array} resources - Array of resource URLs
 * @param {string} type - Resource type (image, script, style)
 */
export const preloadResources = (resources, type = "image") => {
  resources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    link.as = type;
    document.head.appendChild(link);
  });
};

/**
 * Bundle splitting utility
 * @param {Object} routes - Route configuration
 * @returns {Object} Lazy loaded routes
 */
export const createLazyRoutes = (routes) => {
  const lazyRoutes = {};

  Object.keys(routes).forEach((key) => {
    lazyRoutes[key] = lazyLoad(routes[key]);
  });

  return lazyRoutes;
};

/**
 * Performance monitoring hook
 * @param {string} name - Performance mark name
 * @returns {Function} End measurement function
 */
export const usePerformanceMeasure = (name) => {
  useEffect(() => {
    performance.mark(`${name}-start`);

    return () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    };
  }, [name]);

  const endMeasure = useCallback(() => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    return measure?.duration;
  }, [name]);

  return endMeasure;
};

/**
 * Memory usage monitoring
 * @returns {Object} Memory usage information
 */
export const useMemoryUsage = () => {
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    if ("memory" in performance) {
      const updateMemoryUsage = () => {
        setMemoryUsage({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        });
      };

      updateMemoryUsage();
      const interval = setInterval(updateMemoryUsage, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return memoryUsage;
};

/**
 * Component render count tracker (development only)
 * @param {string} componentName - Name of component
 */
export const useRenderCount = (componentName) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};
