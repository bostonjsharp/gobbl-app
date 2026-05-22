"use client";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Lift on hover; useful for tappable cards */
  hover?: boolean;
  /** Outline highlight — for current-selection or focus emphasis */
  active?: boolean;
  /** Inverted ink-on-cream → cream-on-ink (used for Today's Gobble hero) */
  inverted?: boolean;
  /** Remove inner padding; lets the child paint full-bleed */
  bare?: boolean;
}

export function Card({
  hover = false,
  active = false,
  inverted = false,
  bare = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-[box-shadow,transform,border-color] duration-200
        ${inverted
          ? "bg-ink text-bg border-transparent shadow-soft"
          : "bg-surface text-ink border-line shadow-soft dark:bg-roost-800 dark:border-roost-700"}
        ${active ? "ring-2 ring-primary/40 border-primary" : ""}
        ${hover ? "hover:shadow-lift hover:-translate-y-0.5 hover:border-ink-muted cursor-pointer" : ""}
        ${bare ? "p-0" : "p-5"}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/** Small label inside a card header — eyebrow + title */
export function CardEyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-display text-display-sm ${className}`}>{children}</h3>;
}
