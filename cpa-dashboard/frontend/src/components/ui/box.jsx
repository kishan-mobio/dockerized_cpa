import React from "react";
import { cn } from "@/utils/methods/cn";

const Box = React.forwardRef(
  (
    { children, variant = "default", padding = "md", className, ...props },
    ref
  ) => {
    const baseClasses = "rounded-lg transition-all duration-200";

    const variantClasses = {
      default: "bg-white border border-gray-200 shadow-sm",
      elevated: "bg-white border border-gray-200 shadow-md",
      subtle: "bg-gray-50 border border-gray-100",
      user: "bg-blue-600 text-white border-blue-600 shadow-md",
      ai: "bg-gray-100 text-gray-800 border-gray-200 shadow-sm",
      loading: "bg-gray-50 border border-gray-200",
    };

    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
      xl: "p-6",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Box.displayName = "Box";

export { Box };
