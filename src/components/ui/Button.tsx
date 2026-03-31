"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-gradient-to-r from-gobbl-500 to-gobbl-600 hover:from-gobbl-600 hover:to-gobbl-700 text-white shadow-md hover:shadow-lg shadow-gobbl-500/20",
  secondary: "bg-roost-200 hover:bg-roost-300 text-roost-800 dark:bg-roost-700 dark:hover:bg-roost-600 dark:text-roost-100",
  ghost: "hover:bg-roost-200 dark:hover:bg-roost-700 text-roost-700 dark:text-roost-200",
  danger: "bg-plume-500 hover:bg-plume-600 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200
          ${variants[variant]} ${sizes[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.97] hover:-translate-y-0.5"}
          ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
