"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-60",
          variant === "primary" &&
            "bg-ink text-white shadow-soft hover:bg-gray-800 focus:ring-gray-300",
          variant === "secondary" &&
            "border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
          variant === "ghost" &&
            "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
