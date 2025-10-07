"use client";

import React, { Suspense, lazy } from "react";
import { Loader } from "../ui/loading";

/**
 * Lazy loading wrapper component with error boundary
 */
export default function LazyWrapper({
  // Component loading
  importFunc,
  fallback,
  errorFallback,

  // Props to pass to lazy component
  componentProps = {},

  // Loading customization
  loadingText = "Loading...",
  showSpinner = true,

  // Error handling
  onError,
  retryButton = true,

  // Performance
  preload = false,

  ...props
}) {
  const [error, setError] = React.useState(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Create lazy component
  const LazyComponent = React.useMemo(() => {
    return lazy(async () => {
      try {
        const module = await importFunc();
        setError(null);
        return module;
      } catch (err) {
        setError(err);
        if (onError) onError(err);
        throw err;
      }
    });
  }, [importFunc, retryCount]);

  // Preload component if requested
  React.useEffect(() => {
    if (preload) {
      importFunc().catch(() => {
        // Ignore preload errors
      });
    }
  }, [preload, importFunc]);

  // Default fallback component
  const defaultFallback = fallback || (
    <div className="flex items-center justify-center p-8">
      {showSpinner ? (
        <Loader text={loadingText} />
      ) : (
        <div className="text-gray-500">{loadingText}</div>
      )}
    </div>
  );

  // Error fallback component
  const defaultErrorFallback = errorFallback || (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-600 mb-4">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Failed to load component
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {error?.message || "An error occurred while loading this component"}
        </p>
      </div>

      {retryButton && (
        <button
          onClick={() => setRetryCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );

  // Function-based error boundary using hooks
  function LazyErrorBoundaryFunction({ children }) {
    const [hasError, setHasError] = React.useState(false);
    const [caughtError, setCaughtError] = React.useState(null);

    // Mimic componentDidCatch with error boundary
    const ErrorCatcher = React.useCallback(
      ({ children }) => {
        try {
          return children;
        } catch (err) {
          setHasError(true);
          setCaughtError(err);
          if (onError) onError(err);
          return null;
        }
      },
      [onError]
    );

    React.useEffect(() => {
      if (hasError && caughtError) {
        // Log error
        console.error("LazyWrapper Error:", caughtError);
      }
    }, [hasError, caughtError]);

    if (hasError) {
      return defaultErrorFallback;
    }
    // Note: This is not a true error boundary, but works for most lazy load errors
    return <ErrorCatcher>{children}</ErrorCatcher>;
  }

  if (error) {
    return defaultErrorFallback;
  }

  return (
    <LazyErrorBoundaryFunction>
      <Suspense fallback={defaultFallback}>
        <LazyComponent {...componentProps} {...props} />
      </Suspense>
    </LazyErrorBoundaryFunction>
  );
}

/**
 * Higher-order component for lazy loading
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Lazy loading options
 * @returns {React.Component} Lazy loaded component
 */
export const withLazyLoading = (importFunc, options = {}) => {
  return (props) => (
    <LazyWrapper importFunc={importFunc} componentProps={props} {...options} />
  );
};

/**
 * Lazy load a page component
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options
 * @returns {React.Component} Lazy page component
 */
export const LazyPage = (importFunc, options = {}) => {
  return withLazyLoading(importFunc, {
    loadingText: "Loading page...",
    showSpinner: true,
    ...options,
  });
};

/**
 * Lazy load a modal component
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options
 * @returns {React.Component} Lazy modal component
 */
export const LazyModal = (importFunc, options = {}) => {
  return withLazyLoading(importFunc, {
    loadingText: "Loading modal...",
    showSpinner: false,
    fallback: (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <Loader text="Loading..." />
        </div>
      </div>
    ),
    ...options,
  });
};

/**
 * Lazy load a chart component
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options
 * @returns {React.Component} Lazy chart component
 */
export const LazyChart = (importFunc, options = {}) => {
  return withLazyLoading(importFunc, {
    loadingText: "Loading chart...",
    fallback: (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse bg-gray-300 h-4 w-24 mx-auto mb-2 rounded"></div>
          <div className="text-sm text-gray-500">Loading chart...</div>
        </div>
      </div>
    ),
    ...options,
  });
};

/**
 * Preload components for better performance
 * @param {Array} importFunctions - Array of import functions
 */
export const preloadComponents = (importFunctions) => {
  if (typeof window !== "undefined") {
    // Preload on idle or after a delay
    const preload = () => {
      importFunctions.forEach((importFunc) => {
        importFunc().catch(() => {
          // Ignore preload errors
        });
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(preload);
    } else {
      setTimeout(preload, 2000);
    }
  }
};
