import React from "react";
import { DropdownMenu } from "../ui/dropdown-menu";

export default function FilterDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",
  disabled = false,
  label,
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {label}:
        </span>
      )}
      <DropdownMenu
        selected={value}
        onSelect={onChange}
        options={options}
        disabled={disabled}
        buttonClassName="px-4 py-3 rounded-xl border-none shadow-md bg-white text-[#7C7C9A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] flex items-center justify-between min-w-[140px] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        menuClassName="min-w-[140px]"
      />
    </div>
  );
}
