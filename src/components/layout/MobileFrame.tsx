import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen w-full bg-roost-100">
      <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col bg-roost-50 shadow-[0_0_24px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </div>
  );
}
