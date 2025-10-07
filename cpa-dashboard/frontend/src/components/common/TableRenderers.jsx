import { Button } from "../ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate, formatNumber, getInitials } from "@/utils/methods";

// Common status badge renderer
export const renderStatusBadge = (status, customColors = {}) => {
  const defaultColors = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Draft: "bg-gray-50 text-gray-700 border-gray-200",
    Published: "bg-blue-50 text-blue-700 border-blue-200",
    Archived: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const colors = { ...defaultColors, ...customColors };
  const colorClass =
    colors[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-colors duration-150 ${colorClass}`}
      style={{ letterSpacing: "0.02em" }}
    >
      {status}
    </span>
  );
};

// Common role badge renderer
export const renderRoleBadge = (role) => {
  const roleColors = {
    "Super Admin": "bg-red-100 text-red-800",
    Admin: "bg-purple-100 text-purple-800",
    Manager: "bg-blue-100 text-blue-800",
    User: "bg-gray-100 text-gray-800",
    Editor: "bg-green-100 text-green-800",
    Viewer: "bg-yellow-100 text-yellow-800",
  };

  const colorClass = roleColors[role] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {role}
    </span>
  );
};

// Common type badge renderer
export const renderTypeBadge = (type) => {
  const typeColors = {
    Department: "bg-blue-100 text-blue-800",
    Team: "bg-green-100 text-green-800",
    Division: "bg-purple-100 text-purple-800",
    Branch: "bg-yellow-100 text-yellow-800",
    Create: "bg-green-100 text-green-800",
    Read: "bg-blue-100 text-blue-800",
    Update: "bg-yellow-100 text-yellow-800",
    Delete: "bg-red-100 text-red-800",
    Manage: "bg-purple-100 text-purple-800",
    Execute: "bg-indigo-100 text-indigo-800",
  };

  const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {type}
    </span>
  );
};

// Common action buttons renderer with icons
export const renderActionButtons = (item, onView, onEdit, onDelete) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView && onView(item)}
        className="h-8 w-8 p-0 hover:bg-blue-50"
        title="View"
      >
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit && onEdit(item)}
        className="h-8 w-8 p-0 hover:bg-green-50"
        title="Edit"
      >
        <Pencil className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete && onDelete(item)}
        className="h-8 w-8 p-0 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};

// Common tags renderer (for multiple roles, permissions, etc.)
export const renderTags = (tags = [], maxVisible = 3) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return <span className="text-gray-400">None</span>;
  }

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

// Common date formatter - using utility function
export const renderDate = formatDate;

// Common avatar/initials renderer
export const renderAvatar = (name, imageUrl = null, size = "sm") => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Using utility function for getInitials

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium`}
    >
      {getInitials(name)}
    </div>
  );
};

// Common number formatter - using utility function
export const renderNumber = formatNumber;
