import React from "react";
import { Timer } from "lucide-react";

export default function TableHeader({
  title,
  count,
  lastUpdated,
  showCount = true,
  showLastUpdated = true,
  className = "",
  children,
}) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Count indicator */}
          {showCount && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-900 font-semibold text-lg">
                {count} {title}
              </span>
            </div>
          )}

          {/* Last updated */}
          {showLastUpdated && lastUpdated && (
            <div className="flex bg-green-100 items-center space-x-2 text-green-600 text-md font-medium p-1 rounded-md">
              <Timer className="w-4 h-4" />
              Updated {lastUpdated}
            </div>
          )}
        </div>

        {/* Custom content */}
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
