import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "@/utils/methods/helpers";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
  onClear,
  showClearButton = true,
  debounceMs = 300,
  autoFocus = false,
  size = "default", // "sm", "default", "lg"
}) {
  const [localValue, setLocalValue] = useState(value || "");

  // Size classes
  const sizeClasses = {
    sm: "py-2 text-sm",
    default: "py-3",
    lg: "py-4 text-lg",
  };

  // Debounced change handler
  const debouncedOnChange = debounce((newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  }, debounceMs);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue("");
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("");
    }
  };
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C9A]" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full pl-10 pr-4 ${sizeClasses[size]} rounded-xl border-none shadow-md bg-white text-[#7C7C9A] placeholder-[#7C7C9A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {showClearButton && localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7C7C9A] hover:text-[#6C63FF] transition-colors duration-200"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Export specialized variants
export const CompactSearchBar = (props) => (
  <SearchBar size="sm" showClearButton={false} {...props} />
);

export const LargeSearchBar = (props) => <SearchBar size="lg" {...props} />;
