"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Bottom navigation — Harvest direction.
 * 5 tabs: Home · Debate · Skills · Shop · You.
 * Inline SVG icons (no Material Symbols dependency).
 * Active tab pill = primary-soft bg + primary fg.
 */
const TABS = [
  {
    href: "/dashboard",
    label: "Home",
    matches: (p: string) => p === "/" || p.startsWith("/dashboard"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-9z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Debate",
    matches: (p: string) => p.startsWith("/chat"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3h-3l-4 4v-4H7a3 3 0 01-3-3V6z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/skills",
    label: "Skills",
    matches: (p: string) => p.startsWith("/skills"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/shop",
    label: "Shop",
    matches: (p: string) => p.startsWith("/shop"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 8h14l-1.2 12a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "You",
    matches: (p: string) => p.startsWith("/profile"),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-40 flex items-stretch justify-between gap-1 border-t border-line bg-bg px-4 pb-6 pt-2.5"
    >
      {TABS.map((tab) => {
        const active = tab.matches(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
              active ? "text-primary" : "text-ink-muted hover:text-ink-soft"
            }`}
          >
            <span
              className={`flex h-7 items-center justify-center rounded-full px-3 transition-colors ${
                active ? "bg-primary-soft" : ""
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-body text-[10px] font-semibold tracking-wide">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
