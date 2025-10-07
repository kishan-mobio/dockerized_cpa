import React from "react";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";

export default function FiltersBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className = "",
  children,
  layout = "horizontal", // "horizontal" or "vertical"
}) {
  const containerClasses = layout === "vertical" 
    ? "flex flex-col space-y-4" 
    : "flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4";

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Search Bar */}
      <div className="flex-1">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          showClearButton={true}
          onClear={() => onSearchChange("")}
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex items-center space-x-4">
          {filters.map((filter, index) => (
            <FilterDropdown
              key={filter.key || index}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              label={filter.label}
              disabled={filter.disabled}
            />
          ))}
        </div>
      )}

      {/* Custom content */}
      {children}
    </div>
  );
}
