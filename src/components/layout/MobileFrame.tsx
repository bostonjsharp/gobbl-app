import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  fixedHeight?: boolean;
}

export function MobileFrame({ children, fixedHeight }: MobileFrameProps) {
  const heightCls = fixedHeight ? "h-screen overflow-hidden" : "min-h-screen";
  return (
    <div className={`${heightCls} w-full bg-roost-100`}>
      <div className={`relative mx-auto flex ${heightCls} max-w-[480px] flex-col bg-roost-50 shadow-[0_0_24px_rgba(0,0,0,0.06)]`}>
        {children}
      </div>
    </div>
  );
}
