"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/utils/methods/cn";

/**
 * Reusable form input component with built-in validation and styling
 */
export default function FormInput({
  // Basic props
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  autoFocus = false,

  // Label props
  label,
  labelClassName,
  hideLabel = false,

  // Validation props
  error,
  isValid,
  validationMessage,

  // Icon props
  leftIcon,
  rightIcon,
  showPasswordToggle = false,

  // Styling props
  className,
  inputClassName,
  containerClassName,
  size = "default", // "sm", "default", "lg"

  // Description
  description,
  helpText,

  // Additional props
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Determine input type for password fields
  const inputType = type === "password" && showPassword ? "text" : type;

  // Size classes
  const sizeClasses = {
    sm: "h-8 px-2 text-sm",
    default: "h-10 px-3",
    lg: "h-12 px-4 text-lg",
  };

  // Container classes
  const containerClasses = cn("relative w-full", containerClassName);

  // Input wrapper classes
  const inputWrapperClasses = cn("relative flex items-center", className);

  // Input classes
  const inputClasses = cn(
    "w-full border border-gray-300 rounded-md transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    {
      "border-red-500 focus:ring-red-500": error,
      "border-green-500 focus:ring-green-500": isValid && !error,
      "pl-10": leftIcon,
      "pr-10": rightIcon || (type === "password" && showPasswordToggle),
    },
    inputClassName
  );

  // Label classes
  const labelClasses = cn(
    "block text-sm font-medium mb-2 text-gray-700",
    {
      "text-red-600": error,
      "text-green-600": isValid && !error,
    },
    labelClassName
  );

  // Icon classes
  const iconClasses =
    "absolute top-1/2 transform -translate-y-1/2 text-gray-400";
  const leftIconClasses = cn(iconClasses, "left-3");
  const rightIconClasses = cn(iconClasses, "right-3");

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && !hideLabel && (
        <Label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}

      {/* Input wrapper */}
      <div className={inputWrapperClasses}>
        {/* Left icon */}
        {leftIcon && <div className={leftIconClasses}>{leftIcon}</div>}

        {/* Input field */}
        <Input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          {...props}
        />

        {/* Right icon or password toggle */}
        {(rightIcon || (type === "password" && showPasswordToggle)) && (
          <div className={rightIconClasses}>
            {type === "password" && showPasswordToggle ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Validation message */}
      {validationMessage && !error && (
        <p
          className={`mt-1 text-sm ${
            isValid ? "text-green-600" : "text-gray-600"
          }`}
        >
          {validationMessage}
        </p>
      )}

      {/* Help text */}
      {helpText && !error && !validationMessage && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

// Export variants for common use cases
export const EmailInput = (props) => (
  <FormInput
    type="email"
    autoComplete="email"
    leftIcon={
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
      </svg>
    }
    {...props}
  />
);

export const PasswordInput = (props) => (
  <FormInput
    type="password"
    autoComplete="current-password"
    showPasswordToggle={true}
    leftIcon={
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    }
    {...props}
  />
);

export const SearchInput = (props) => (
  <FormInput
    type="search"
    leftIcon={
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    }
    {...props}
  />
);
