"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Error Boundary Component for catching JavaScript errors
 */

import { useState, useCallback } from "react";

function ErrorBoundaryFunction(props) {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null,
    errorInfo: null,
    eventId: null,
  });

  const handleRetry = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoHome = useCallback(() => {
    window.location.href = "/";
  }, []);

  const reportError = useCallback(
    (error, errorInfo) => {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        url: typeof window !== "undefined" ? window.location.href : "",
        userId: props.userId,
      };
      if (props.reportError) {
        props.reportError(errorReport);
      }
    },
    [props]
  );

  // Custom error boundary logic using ErrorBoundary from react-error-boundary
  // or fallback to manual try/catch for children
  // For this conversion, we use react-error-boundary for best practice
  // If not available, fallback to a simple try/catch render
  // But for now, let's use react-error-boundary
  // If you want to avoid external deps, you can use a custom implementation

  // Dynamically import react-error-boundary if available
  let ErrorBoundaryReal = null;
  try {
    // eslint-disable-next-line global-require
    ErrorBoundaryReal = require("react-error-boundary").ErrorBoundary;
  } catch {
    ErrorBoundaryReal = null;
  }

  const fallbackRender = ({ error, resetErrorBoundary }) => {
    // Custom fallback UI
    if (props.fallback) {
      return props.fallback(error, null, handleRetry);
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          {/* Error Title */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {props.title || "Something went wrong"}
          </h1>
          {/* Error Message */}
          <p className="text-gray-600 mb-6">
            {props.message ||
              "We're sorry, but something unexpected happened. Please try again or contact support if the problem persists."}
          </p>
          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && error && (
            <details className="text-left mb-6 p-4 bg-gray-100 rounded-md">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                <Bug className="inline h-4 w-4 mr-1" />
                Error Details (Development)
              </summary>
              <div className="text-xs text-gray-600 font-mono">
                <div className="mb-2">
                  <strong>Error:</strong> {error.message}
                </div>
                <div className="mb-2">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1 text-xs">
                    {error.stack}
                  </pre>
                </div>
              </div>
            </details>
          )}
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {props.showRetry !== false && (
              <Button
                onClick={resetErrorBoundary}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {props.showReload && (
              <Button
                onClick={handleReload}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            )}
            {props.showHome !== false && (
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>
          {/* Support Contact */}
          {props.supportEmail && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <a
                  href={`mailto:${props.supportEmail}`}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Contact Support
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (ErrorBoundaryReal) {
    return (
      <ErrorBoundaryReal
        fallbackRender={fallbackRender}
        onError={(error, errorInfo) => {
          setErrorState({ hasError: true, error, errorInfo, eventId: null });
          reportError(error, errorInfo);
          if (props.onError) props.onError(error, errorInfo);
        }}
        onReset={handleRetry}
      >
        {props.children}
      </ErrorBoundaryReal>
    );
  }

  // Fallback: manual try/catch (not as robust)
  if (errorState.hasError) {
    return fallbackRender({
      error: errorState.error,
      resetErrorBoundary: handleRetry,
    });
  }
  try {
    return props.children;
  } catch (error) {
    setErrorState({ hasError: true, error, errorInfo: null, eventId: null });
    reportError(error, null);
    if (props.onError) props.onError(error, null);
    return fallbackRender({ error, resetErrorBoundary: handleRetry });
  }
}

export default ErrorBoundaryFunction;

/**
 * Higher-order component for wrapping components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props for error boundary
 * @returns {React.Component} Wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundaryFunction {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryFunction>
  );
  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

/**
 * Specialized error boundaries for different contexts
 */

// Page-level error boundary
export const PageErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundaryFunction
    title="Page Error"
    message="This page encountered an error. Please try refreshing or go back to the home page."
    showReload={true}
    showHome={true}
    {...props}
  >
    {children}
  </ErrorBoundaryFunction>
);

export const ComponentErrorBoundary = ({
  children,
  componentName,
  ...props
}) => (
  <ErrorBoundaryFunction
    title={`${componentName} Error`}
    message="This component encountered an error. Please try again."
    showRetry={true}
    showReload={false}
    showHome={false}
    {...props}
  >
    {children}
  </ErrorBoundaryFunction>
);

export const APIErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundaryFunction
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    showRetry={true}
    showReload={true}
    showHome={false}
    {...props}
  >
    {children}
  </ErrorBoundaryFunction>
);

export const AsyncErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundaryFunction
    title="Loading Error"
    message="Failed to load this component. Please try again."
    showRetry={true}
    showReload={false}
    showHome={false}
    {...props}
  >
    {children}
  </ErrorBoundaryFunction>
);
