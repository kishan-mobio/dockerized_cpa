import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageTitle({
  title,
  subtitle,
  addButtonText,
  addButtonPath,
  onAddClick,
  showAddButton = true,
  addButtonIcon = <Plus />,
  className = "",
  children,
}) {
  const router = useRouter();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else if (addButtonPath) {
      router.push(addButtonPath);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between w-full mb-5 ${className}`}>
      {/* Left: Title and Subtitle */}
      <div className="mb-4 md:mb-0">
        <h2 className="text-xl md:text-2xl font-bold text-[#23235F] mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-400 text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Center: Custom content */}
      {children && (
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Right: Add Button */}
      {showAddButton && addButtonText && (
        <div className="flex items-center mt-4 md:mt-0">
          <Button leftIcon={addButtonIcon} onClick={handleAddClick}>
            {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
