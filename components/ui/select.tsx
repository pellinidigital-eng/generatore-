"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
        <select
          ref={ref}
          className={cn(
            "h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-base text-gray-950 shadow-sm outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-200",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </label>
    );
  }
);

Select.displayName = "Select";
