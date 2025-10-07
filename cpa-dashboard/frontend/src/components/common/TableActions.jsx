import React from "react";
import { Button } from "../ui/button";
import { Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const iconMap = {
  edit: <Edit className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
};

export default function TableActions({
  actions = [],
  item,
  className = "",
  variant = "buttons", // "buttons" or "dropdown"
}) {
  const handleAction = (action, item) => {
    if (action.onClick) {
      action.onClick(item);
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleAction(action, item)}
                className={action.className || ""}
              >
                {action.icon && (
                  <span className="mr-2">
                    {typeof action.icon === "string" ? iconMap[action.icon] : action.icon}
                  </span>
                )}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size={action.size || "sm"}
          onClick={() => handleAction(action, item)}
          className={action.className || ""}
          disabled={action.disabled}
        >
          {action.icon && (
            <span className="mr-1">
              {typeof action.icon === "string" ? iconMap[action.icon] : action.icon}
            </span>
          )}
          {action.label}
        </Button>
      ))}
    </div>
  );
}