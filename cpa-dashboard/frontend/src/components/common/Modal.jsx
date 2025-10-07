"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/utils/methods/cn";

/**
 * Reusable modal component with different variants and configurations
 */
export default function Modal({
  // Basic props
  isOpen,
  onClose,
  title,
  description,
  children,

  // Variant props
  variant = "default", // "default", "danger", "success", "warning", "info"
  size = "default", // "sm", "default", "lg", "xl", "full"

  // Action props
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showActions = true,
  showCloseButton = true,

  // Loading states
  isLoading = false,
  isConfirmLoading = false,
  isCancelLoading = false,

  // Styling props
  className,
  headerClassName,
  contentClassName,
  footerClassName,

  // Behavior props
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventClose = false,

  // Icon props
  icon,
  showIcon = true,

  // Additional props
  ...props
}) {
  // Size classes
  const sizeClasses = {
    sm: "sm:max-w-sm",
    default: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    full: "sm:max-w-full sm:m-4",
  };

  // Variant configurations
  const variants = {
    default: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
  };

  const variantConfig = variants[variant] || variants.default;
  const IconComponent = icon || variantConfig.icon;

  // Handle close
  const handleClose = () => {
    if (preventClose || isLoading) return;
    onClose();
  };

  // Handle confirm
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
    } else {
      handleClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnOverlayClick ? handleClose : undefined}
      {...props}
    >
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        {/* Close button */}
        {showCloseButton && !preventClose && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}

        {/* Header */}
        <DialogHeader className={cn("space-y-3", headerClassName)}>
          {/* Icon and title */}
          {(title || showIcon) && (
            <div className="flex items-center gap-3">
              {showIcon && IconComponent && (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    variantConfig.iconBg
                  )}
                >
                  <IconComponent
                    className={cn("h-5 w-5", variantConfig.iconColor)}
                  />
                </div>
              )}
              {title && (
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {title}
                </DialogTitle>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <DialogDescription className="text-sm text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Content */}
        {children && (
          <div className={cn("py-4", contentClassName)}>{children}</div>
        )}

        {/* Footer */}
        {showActions && (
          <DialogFooter
            className={cn(
              "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
              footerClassName
            )}
          >
            {/* Cancel button */}
            {onCancel !== null && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || isCancelLoading}
                className="mt-3 sm:mt-0"
              >
                {isCancelLoading ? "Loading..." : cancelText}
              </Button>
            )}

            {/* Confirm button */}
            {onConfirm && (
              <Button
                variant={variant === "danger" ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={isLoading || isConfirmLoading}
              >
                {isConfirmLoading ? "Loading..." : confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Export specialized modal variants
export const ConfirmModal = (props) => (
  <Modal
    variant="default"
    confirmText="Confirm"
    cancelText="Cancel"
    {...props}
  />
);

export const DeleteModal = (props) => (
  <Modal
    variant="danger"
    confirmText="Delete"
    cancelText="Cancel"
    title="Delete Item"
    description="Are you sure you want to delete this item? This action cannot be undone."
    {...props}
  />
);

export const SuccessModal = (props) => (
  <Modal variant="success" confirmText="OK" onCancel={null} {...props} />
);

export const ErrorModal = (props) => (
  <Modal variant="danger" confirmText="OK" onCancel={null} {...props} />
);

export const InfoModal = (props) => (
  <Modal variant="info" confirmText="OK" onCancel={null} {...props} />
);

export const WarningModal = (props) => (
  <Modal
    variant="warning"
    confirmText="Continue"
    cancelText="Cancel"
    {...props}
  />
);
