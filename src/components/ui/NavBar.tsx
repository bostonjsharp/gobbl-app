"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Roost", icon: "🏠" },
  { href: "/arena", label: "Arena", icon: "⚔️" },
  { href: "/shop", label: "Bazaar", icon: "🛒" },
  { href: "/profile", label: "Nest", icon: "🪺" },
  { href: "/leaderboard", label: "Flock", icon: "🏆" },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-roost-200 bg-roost-50/80 backdrop-blur-lg dark:border-roost-800 dark:bg-roost-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-gobbl-600 dark:text-gobbl-400 group">
          <span className="text-2xl transition-transform group-hover:animate-gobble">🦃</span>
          <span className="bg-gradient-to-r from-gobbl-600 to-plume-500 bg-clip-text text-transparent">Gobbl</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all
                  ${active
                    ? "bg-gobbl-100 text-gobbl-700 dark:bg-gobbl-900/30 dark:text-gobbl-400"
                    : "text-roost-600 hover:bg-roost-100 dark:text-roost-400 dark:hover:bg-roost-800"
                  }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-2 rounded-lg px-3 py-2 text-sm text-roost-500 hover:bg-roost-100 hover:text-plume-600 dark:hover:bg-roost-800 transition-colors"
          >
            Fly the Coop
          </button>
        </div>
      </div>
    </nav>
  );
}
