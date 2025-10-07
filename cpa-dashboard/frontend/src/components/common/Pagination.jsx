import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  className = "",
  showInfo = true,
  maxVisiblePages = 3,
}) {
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`px-4 py-2 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Results info */}
        {showInfo && (
          <div className="text-md text-gray-600 font-medium">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg hover:bg-white disabled:hover:bg-transparent transition-all duration-200 hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg text-md font-semibold transition-all duration-200 hover:shadow-md ${
                currentPage === page
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-white hover:text-blue-600"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Show ellipsis if there are more pages */}
          {totalPages > maxVisiblePages && visiblePages[visiblePages.length - 1] < totalPages && (
            <span className="px-2 text-gray-400 font-medium">...</span>
          )}

          {/* Next button */}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg hover:bg-white disabled:hover:bg-transparent transition-all duration-200 hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
