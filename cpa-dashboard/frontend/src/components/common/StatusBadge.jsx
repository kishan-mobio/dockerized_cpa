import React from "react";

const statusStyles = {
  Active: "bg-green-100 text-green-700 border-green-300",
  Inactive: "bg-red-100 text-red-700 border-red-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Draft: "bg-gray-100 text-gray-700 border-gray-300",
  Published: "bg-blue-100 text-blue-700 border-blue-300",
  Archived: "bg-purple-100 text-purple-700 border-purple-300",
};

const typeStyles = {
  Department: "bg-blue-100 text-blue-800",
  Team: "bg-green-100 text-green-800",
  Division: "bg-purple-100 text-purple-800",
  Admin: "bg-red-100 text-red-800",
  Manager: "bg-blue-100 text-blue-800",
  User: "bg-gray-100 text-gray-800",
  Enterprise: "bg-purple-100 text-purple-800",
  Professional: "bg-blue-100 text-blue-800",
  Basic: "bg-gray-100 text-gray-800",
};

export default function StatusBadge({
  status,
  type = "status", // "status" or "type"
  className = "",
  size = "sm", // "xs", "sm", "md", "lg"
  variant = "default", // "default", "outline", "solid"
}) {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full font-semibold transition-all duration-200 
    transform hover:scale-105 inline-flex items-center justify-center
  `;

  let colorClasses = "";
  
  if (type === "status") {
    colorClasses = statusStyles[status] || statusStyles.Draft;
  } else if (type === "type") {
    colorClasses = typeStyles[status] || typeStyles.User;
  }

  if (variant === "outline") {
    colorClasses += " border";
  } else if (variant === "solid") {
    // For solid variant, we'd need to adjust the colors to have solid backgrounds
    colorClasses = colorClasses.replace("100", "500").replace("700", "white").replace("800", "white");
  }

  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {status}
    </span>
  );
}
