import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu
} from "../ui/dropdown-menu";

export default function PageHeader({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  filters = [],
  addButtonText,
  addButtonPath,
  showAddButton = true,
  showSearch = true,
  showFilters = true,
}) {
  const router = useRouter();

  const handleAddClick = () => {
    if (addButtonPath) {
      router.push(addButtonPath);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-6">
      {/* Left: Title and Subtitle */}
      <div className="mb-4 md:mb-0">
        <h2 className="text-xl md:text-2xl font-bold text-[#23235F] mb-1">
          {title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          {subtitle}
        </p>
      </div>

      {/* Center: Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex-1 flex items-center justify-center space-x-4">
          {showSearch && (
            <div className="relative w-full max-w-md">
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7C7C9A]"
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
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-md bg-white text-[#7C7C9A] placeholder-[#7C7C9A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-all duration-200"
              />
            </div>
          )}
          
          {showFilters && filters.length > 0 && (
            <div className="flex items-center space-x-4">
              {filters.map((filter, index) => (
                <DropdownMenu
                  key={index}
                  selected={filter.value}
                  onSelect={filter.onChange}
                  options={filter.options}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Right: Add Button */}
      {showAddButton && addButtonText && (
        <div className="flex items-center mt-4 md:mt-0">
          <Button leftIcon={<Plus />} onClick={handleAddClick}>
            {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
