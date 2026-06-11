"use client";

import { usePathname } from "next/navigation";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDebateView =
    (/^\/chat\/[^/]+$/.test(pathname) && pathname !== "/chat/setup") ||
    /^\/skills\/[^/]+$/.test(pathname);

  return (
    <MobileFrame fixedHeight={isDebateView}>
      {!isDebateView && <TopAppBar />}
      <main
        className={
          isDebateView
            ? "flex-1 min-h-0 overflow-hidden"
            : "flex-1 px-margin-mobile py-lg"
        }
      >
        {children}
      </main>
      {!isDebateView && <BottomNav />}
    </MobileFrame>
  );
}
