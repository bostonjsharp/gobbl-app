"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const TABS = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/chat", icon: "chat_bubble", label: "Chat" },
  { href: "/skills", icon: "school", label: "Skills" },
  { href: "/shop", icon: "storefront", label: "Shop" },
  { href: "/profile", icon: "person", label: "Profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex h-20 items-stretch border-t border-roost-200 bg-roost-50">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              active ? "text-gobbl-500" : "text-roost-500 hover:text-gobbl-500"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={tab.icon} filled={active} className="text-[24px]" />
            <span className="font-display text-[12px] font-semibold leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
