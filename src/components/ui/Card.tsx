"use client";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function Card({ hover = false, glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-roost-200 bg-white p-6 shadow-sm dark:border-roost-800 dark:bg-roost-900
        ${hover ? "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gobbl-300 dark:hover:border-gobbl-700 cursor-pointer" : ""}
        ${glow ? "ring-2 ring-golden-400/30 shadow-golden-400/10" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
