"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-roost-700 dark:text-roost-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-roost-300 bg-white px-4 py-2.5 text-roost-900 
            placeholder:text-roost-400 focus:border-gobbl-500 focus:outline-none focus:ring-2 focus:ring-gobbl-500/20
            dark:border-roost-700 dark:bg-roost-800 dark:text-roost-100 dark:placeholder:text-roost-500
            transition-all duration-200
            ${error ? "border-plume-500 focus:border-plume-500 focus:ring-plume-500/20" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-plume-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
