"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Wifi,
  Server,
  Shield,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";

/**
 * Error Display Component for showing different types of errors
 */
export default function ErrorDisplay({
  // Error details
  error,
  title,
  message,
  type = "general", // "general", "network", "server", "auth", "validation", "notfound"
  
  // Display options
  variant = "card", // "card", "inline", "banner", "modal"
  size = "default", // "sm", "default", "lg"
  
  // Actions
  onRetry,
  onGoBack,
  onGoHome,
  onDismiss,
  
  // Customization
  showIcon = true,
  showActions = true,
  retryText = "Try Again",
  backText = "Go Back",
  homeText = "Go Home",
  dismissText = "Dismiss",
  
  // Additional props
  className = "",
  ...props
}) {
  // Error type configurations
  const errorConfigs = {
    general: {
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      defaultTitle: "Error",
      defaultMessage: "Something went wrong. Please try again.",
    },
    network: {
      icon: Wifi,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      defaultTitle: "Connection Error",
      defaultMessage: "Unable to connect to the server. Please check your internet connection.",
    },
    server: {
      icon: Server,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      defaultTitle: "Server Error",
      defaultMessage: "The server encountered an error. Please try again later.",
    },
    auth: {
      icon: Shield,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      defaultTitle: "Authentication Required",
      defaultMessage: "Please log in to continue.",
    },
    validation: {
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      defaultTitle: "Validation Error",
      defaultMessage: "Please check your input and try again.",
    },
    notfound: {
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      defaultTitle: "Not Found",
      defaultMessage: "The requested resource could not be found.",
    },
  };

  const config = errorConfigs[type] || errorConfigs.general;
  const IconComponent = config.icon;

  // Size configurations
  const sizeConfigs = {
    sm: {
      container: "p-3",
      icon: "h-4 w-4",
      title: "text-sm font-medium",
      message: "text-xs",
      button: "text-xs px-2 py-1",
    },
    default: {
      container: "p-4",
      icon: "h-5 w-5",
      title: "text-base font-medium",
      message: "text-sm",
      button: "text-sm px-3 py-1.5",
    },
    lg: {
      container: "p-6",
      icon: "h-6 w-6",
      title: "text-lg font-medium",
      message: "text-base",
      button: "text-base px-4 py-2",
    },
  };

  const sizeConfig = sizeConfigs[size] || sizeConfigs.default;

  // Get display title and message
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || error?.message || config.defaultMessage;

  // Render actions
  const renderActions = () => {
    if (!showActions) return null;

    const actions = [];

    if (onRetry) {
      actions.push(
        <Button
          key="retry"
          onClick={onRetry}
          variant="outline"
          size="sm"
          className={`${sizeConfig.button} flex items-center gap-1`}
        >
          <RefreshCw className="h-3 w-3" />
          {retryText}
        </Button>
      );
    }

    if (onGoBack) {
      actions.push(
        <Button
          key="back"
          onClick={onGoBack}
          variant="ghost"
          size="sm"
          className={`${sizeConfig.button} flex items-center gap-1`}
        >
          <ArrowLeft className="h-3 w-3" />
          {backText}
        </Button>
      );
    }

    if (onGoHome) {
      actions.push(
        <Button
          key="home"
          onClick={onGoHome}
          variant="ghost"
          size="sm"
          className={`${sizeConfig.button} flex items-center gap-1`}
        >
          <Home className="h-3 w-3" />
          {homeText}
        </Button>
      );
    }

    if (onDismiss) {
      actions.push(
        <Button
          key="dismiss"
          onClick={onDismiss}
          variant="ghost"
          size="sm"
          className={sizeConfig.button}
        >
          {dismissText}
        </Button>
      );
    }

    return actions.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-3">
        {actions}
      </div>
    ) : null;
  };

  // Render content
  const renderContent = () => (
    <>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={`flex-shrink-0 ${config.color}`}>
            <IconComponent className={sizeConfig.icon} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`${config.color} ${sizeConfig.title} mb-1`}>
            {displayTitle}
          </h3>
          <p className={`text-gray-600 ${sizeConfig.message}`}>
            {displayMessage}
          </p>
          
          {/* Error details in development */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-gray-500">
                Error Details (Development)
              </summary>
              <pre className="mt-1 text-xs text-gray-500 whitespace-pre-wrap font-mono">
                {error.stack || JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
      {renderActions()}
    </>
  );

  // Variant-specific rendering
  switch (variant) {
    case "inline":
      return (
        <Alert className={`${config.borderColor} ${config.bgColor} ${className}`} {...props}>
          <AlertDescription>
            <div className="flex items-center gap-2">
              {showIcon && <IconComponent className={`${sizeConfig.icon} ${config.color}`} />}
              <span className={sizeConfig.message}>{displayMessage}</span>
              {renderActions()}
            </div>
          </AlertDescription>
        </Alert>
      );

    case "banner":
      return (
        <div className={`${config.bgColor} ${config.borderColor} border-l-4 ${sizeConfig.container} ${className}`} {...props}>
          {renderContent()}
        </div>
      );

    case "modal":
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-md w-full ${sizeConfig.container}`}>
            {renderContent()}
          </div>
        </div>
      );

    case "card":
    default:
      return (
        <div className={`bg-white rounded-lg border ${config.borderColor} shadow-sm ${sizeConfig.container} ${className}`} {...props}>
          {renderContent()}
        </div>
      );
  }
}

// Specialized error components
export const NetworkError = (props) => (
  <ErrorDisplay type="network" {...props} />
);

export const ServerError = (props) => (
  <ErrorDisplay type="server" {...props} />
);

export const AuthError = (props) => (
  <ErrorDisplay type="auth" {...props} />
);

export const ValidationError = (props) => (
  <ErrorDisplay type="validation" {...props} />
);

export const NotFoundError = (props) => (
  <ErrorDisplay type="notfound" {...props} />
);

// Error list component for displaying multiple errors
export const ErrorList = ({ errors = [], onDismiss, className = "" }) => {
  if (errors.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {errors.map((error, index) => (
        <ErrorDisplay
          key={error.id || index}
          error={error}
          variant="inline"
          size="sm"
          onDismiss={onDismiss ? () => onDismiss(error.id || index) : undefined}
        />
      ))}
    </div>
  );
};
