import * as React from "react";

import { cn } from "@/utils/methods/cn";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full h-10 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        "aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
