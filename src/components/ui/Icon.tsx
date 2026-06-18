import type { SVGProps } from "react";

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

const baseSvgProps: SVGProps<SVGSVGElement> = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function Home({ filled }: { filled: boolean }) {
  return (
    <svg {...baseSvgProps} {...(filled ? { fill: "currentColor", stroke: "none" } : {})}>
      <path d="M3 11.5 12 3l9 8.5V21a1 1 0 0 1-1 1h-5v-6.5h-6V22H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function ChatBubble({ filled }: { filled: boolean }) {
  return (
    <svg {...baseSvgProps} {...(filled ? { fill: "currentColor", stroke: "none" } : {})}>
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4z" />
    </svg>
  );
}

function School({ filled }: { filled: boolean }) {
  return (
    <svg {...baseSvgProps}>
      <path
        d="M2 9l10-5 10 5-10 5z"
        {...(filled ? { fill: "currentColor", stroke: "currentColor" } : {})}
      />
      <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
      <path d="M22 9v5" />
    </svg>
  );
}

function Storefront({ filled }: { filled: boolean }) {
  return (
    <svg {...baseSvgProps}>
      <path
        d="M3 9l1.5-4.5h15L21 9"
        {...(filled ? { fill: "currentColor", stroke: "currentColor" } : {})}
      />
      <path d="M3 9v2a2.5 2.5 0 0 0 4.5 1.5A2.5 2.5 0 0 0 12 12a2.5 2.5 0 0 0 4.5.5A2.5 2.5 0 0 0 21 11V9" />
      <path d="M4 12.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7.5" />
      <path d="M10 21v-5h4v5" {...(filled ? { fill: "transparent" } : {})} />
    </svg>
  );
}

function Person({ filled }: { filled: boolean }) {
  return (
    <svg {...baseSvgProps} {...(filled ? { fill: "currentColor", stroke: "none" } : {})}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" {...(filled ? {} : { fill: "none" })} />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg {...baseSvgProps}>
      <polyline points="9 5 16 12 9 19" />
    </svg>
  );
}

const ICONS: Record<string, (props: { filled: boolean }) => JSX.Element> = {
  home: Home,
  chat_bubble: ChatBubble,
  school: School,
  storefront: Storefront,
  person: Person,
  chevron_right: () => <ChevronRight />,
};

export function Icon({ name, filled = false, className = "" }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
      {Glyph ? <Glyph filled={filled} /> : <span className="font-mono text-[0.65em]">{name}</span>}
    </span>
  );
}
