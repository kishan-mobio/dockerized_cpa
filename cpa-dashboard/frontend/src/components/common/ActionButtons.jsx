"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Copy,
  Download,
  Share,
  Archive,
  Star,
  Settings,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/utils/methods/cn";

// Icon mapping for common actions
const iconMap = {
  view: Eye,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  download: Download,
  share: Share,
  archive: Archive,
  star: Star,
  settings: Settings,
  add: Plus,
  remove: Minus,
  more: MoreHorizontal,
};

// Color mapping for different action types
const colorMap = {
  view: "text-blue-600 hover:bg-blue-50",
  edit: "text-green-600 hover:bg-green-50",
  delete: "text-red-600 hover:bg-red-50",
  copy: "text-gray-600 hover:bg-gray-50",
  download: "text-purple-600 hover:bg-purple-50",
  share: "text-indigo-600 hover:bg-indigo-50",
  archive: "text-orange-600 hover:bg-orange-50",
  star: "text-yellow-600 hover:bg-yellow-50",
  settings: "text-gray-600 hover:bg-gray-50",
  add: "text-green-600 hover:bg-green-50",
  remove: "text-red-600 hover:bg-red-50",
};

/**
 * Reusable ActionButtons component for consistent action button patterns
 */
export default function ActionButtons({
  // Actions configuration
  actions = [],
  item,

  // Display options
  variant = "buttons", // "buttons", "dropdown", "mixed"
  size = "sm", // "sm", "default", "lg"
  maxVisibleActions = 3,

  // Styling
  className = "",
  buttonClassName = "",
  dropdownClassName = "",

  // Behavior
  disabled = false,
  loading = false,

  // Custom props
  ...props
}) {
  // Filter actions based on conditions
  const availableActions = actions.filter((action) => {
    if (action.condition && typeof action.condition === "function") {
      return action.condition(item);
    }
    return action.hidden !== true;
  });

  // Split actions for mixed variant
  const visibleActions =
    variant === "mixed"
      ? availableActions.slice(0, maxVisibleActions)
      : availableActions;

  const dropdownActions =
    variant === "mixed" ? availableActions.slice(maxVisibleActions) : [];

  // Handle action click
  const handleActionClick = (action, item) => {
    if (action.onClick && typeof action.onClick === "function") {
      action.onClick(item);
    }
  };

  // Get icon component
  const getIcon = (action) => {
    if (action.icon) {
      if (typeof action.icon === "string") {
        const IconComponent = iconMap[action.icon];
        return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
      }
      return action.icon;
    }
    return null;
  };

  // Get action button classes
  const getButtonClasses = (action) => {
    const baseClasses = "h-8 w-8 p-0 transition-all duration-200";
    const colorClasses =
      colorMap[action.type] || "text-gray-600 hover:bg-gray-50";
    return cn(baseClasses, colorClasses, buttonClassName);
  };

  // Render individual action button
  const renderActionButton = (action, index) => {
    const icon = getIcon(action);

    return (
      <Button
        key={action.key || index}
        variant="ghost"
        size={size}
        onClick={() => handleActionClick(action, item)}
        disabled={disabled || loading || action.disabled}
        className={getButtonClasses(action)}
        title={action.tooltip || action.label}
        {...(action.props || {})}
      >
        {icon}
      </Button>
    );
  };

  // Render dropdown menu item
  const renderDropdownItem = (action, index) => {
    const icon = getIcon(action);

    return (
      <DropdownMenuItem
        key={action.key || index}
        onClick={() => handleActionClick(action, item)}
        disabled={disabled || loading || action.disabled}
        className={cn(
          "cursor-pointer flex items-center gap-2",
          action.destructive && "text-red-600 focus:text-red-600"
        )}
      >
        {icon}
        <span>{action.label}</span>
      </DropdownMenuItem>
    );
  };

  // Don't render if no actions
  if (availableActions.length === 0) {
    return null;
  }

  // Buttons only variant
  if (variant === "buttons") {
    return (
      <div className={cn("flex items-center space-x-1", className)} {...props}>
        {visibleActions.map(renderActionButton)}
      </div>
    );
  }

  // Dropdown only variant
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            disabled={disabled || loading}
            className={cn("h-8 w-8 p-0", buttonClassName)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn("w-48", dropdownClassName)}
        >
          {availableActions.map((action, index) => {
            if (action.separator) {
              return <DropdownMenuSeparator key={`separator-${index}`} />;
            }
            return renderDropdownItem(action, index);
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Mixed variant (buttons + dropdown)
  if (variant === "mixed") {
    return (
      <div className={cn("flex items-center space-x-1", className)} {...props}>
        {/* Visible action buttons */}
        {visibleActions.map(renderActionButton)}

        {/* Dropdown for additional actions */}
        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={size}
                disabled={disabled || loading}
                className={cn("h-8 w-8 p-0", buttonClassName)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn("w-48", dropdownClassName)}
            >
              {dropdownActions.map((action, index) => {
                if (action.separator) {
                  return <DropdownMenuSeparator key={`separator-${index}`} />;
                }
                return renderDropdownItem(action, index);
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return null;
}

// Export common action configurations
export const COMMON_ACTIONS = {
  view: (onClick) => ({
    key: "view",
    type: "view",
    icon: "view",
    label: "View",
    tooltip: "View details",
    onClick,
  }),

  edit: (onClick) => ({
    key: "edit",
    type: "edit",
    icon: "edit",
    label: "Edit",
    tooltip: "Edit item",
    onClick,
  }),

  delete: (onClick) => ({
    key: "delete",
    type: "delete",
    icon: "delete",
    label: "Delete",
    tooltip: "Delete item",
    destructive: true,
    onClick,
  }),

  copy: (onClick) => ({
    key: "copy",
    type: "copy",
    icon: "copy",
    label: "Copy",
    tooltip: "Copy item",
    onClick,
  }),

  download: (onClick) => ({
    key: "download",
    type: "download",
    icon: "download",
    label: "Download",
    tooltip: "Download item",
    onClick,
  }),
};

// Export specialized variants
export const ViewEditDeleteActions = ({ onView, onEdit, onDelete, item }) => (
  <ActionButtons
    actions={[
      COMMON_ACTIONS.view(onView),
      COMMON_ACTIONS.edit(onEdit),
      COMMON_ACTIONS.delete(onDelete),
    ]}
    item={item}
    variant="buttons"
  />
);

export const DropdownActions = ({ actions, item }) => (
  <ActionButtons actions={actions} item={item} variant="dropdown" />
);
