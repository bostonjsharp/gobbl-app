"use client";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  civilityScore?: number | null;
}

function FeatherScore({ score }: { score: number }) {
  const filled = Math.round(score);
  return (
    <div className="mt-2 flex items-center gap-0.5 text-xs">
      <span className="text-roost-500 mr-1">Civility:</span>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={`text-[10px] transition-all ${i < filled ? "opacity-100 scale-100" : "opacity-30 scale-75"}`}
        >
          🪶
        </span>
      ))}
    </div>
  );
}

export function MessageBubble({ role, content, civilityScore }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      {!isUser && (
        <div className="mr-2 mt-1 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-roost-100 flex items-center justify-center">
            <span className="text-sm">🦃</span>
          </div>
        </div>
      )}
      <div
        className={`relative max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gobbl-500 text-white rounded-br-md shadow-md shadow-gobbl-500/20"
            : "bg-roost-100 text-roost-700 rounded-bl-md"
        }`}
      >
        <div className={`text-xs font-semibold mb-1 ${isUser ? "text-white/70" : "text-gobbl-600"}`}>
          {isUser ? "You" : "Gobbl"}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {isUser && civilityScore != null && (
          <FeatherScore score={civilityScore} />
        )}
      </div>
    </div>
  );
}
