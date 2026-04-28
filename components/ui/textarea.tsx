"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
        <textarea
          ref={ref}
          className={cn(
            "min-h-36 w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base leading-7 text-gray-950 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-200",
            className
          )}
          {...props}
        />
      </label>
    );
  }
);

Textarea.displayName = "Textarea";
