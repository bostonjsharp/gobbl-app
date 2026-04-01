"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "../ui/Button";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  civilityScore?: number | null;
}

interface ChatInterfaceProps {
  debateId: string;
  initialMessages: ChatMsg[];
  maxTurns: number;
  onFinish: (result: FinishResult) => void;
}

export interface FinishResult {
  overallScore: number;
  dimensions: Record<string, number> | null;
  xp: { base: number; difficultyBonus: number; dailyBonus: number; streakMultiplier: number; total: number };
  feathers: { base: number; difficultyBonus: number; dailyBonus: number; total: number };
  previousLevel: number;
  newLevel: number;
  newBadges: string[];
  streak: number;
}

export function ChatInterface({ debateId, initialMessages, maxTurns, onFinish }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnNumber, setTurnNumber] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (finish = false) => {
    if (!input.trim() && !finish) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);

    if (userMsg) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debateId, message: userMsg, finish }),
      });
      const data = await res.json();

      if (data.finished) {
        onFinish(data);
        return;
      }

      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === "user") {
          updated[updated.length - 1].civilityScore = data.civility?.overall;
        }
        updated.push({ role: "assistant", content: data.aiResponse });
        return updated;
      });
      setTurnNumber(data.turnNumber);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something ruffled my feathers. Let's try that again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debateId, message: "", finish: true }),
      });
      const data = await res.json();
      if (data.finished) onFinish(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const atMaxTurns = turnNumber >= maxTurns;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-roost-200 px-4 py-2 dark:border-roost-800">
        <span className="text-sm text-roost-500 flex items-center gap-1">
          Round {turnNumber}/{maxTurns}
        </span>
        <div className="h-2.5 flex-1 mx-4 rounded-full bg-roost-200 dark:bg-roost-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gobbl-400 to-golden-500 transition-all duration-500"
            style={{ width: `${(turnNumber / maxTurns) * 100}%` }}
          />
        </div>
        {turnNumber >= 2 && (
          <Button variant="secondary" size="sm" onClick={handleFinish} disabled={loading}>
            Wrap Up
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} civilityScore={msg.civilityScore} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 ml-10">
              <div className="rounded-2xl bg-roost-100 px-5 py-3 dark:bg-roost-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg animate-wiggle inline-block">🥚</span>
                  <span className="text-xs text-roost-500">Gobbl is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-roost-200 p-4 dark:border-roost-800">
        {atMaxTurns ? (
          <div className="text-center">
            <p className="mb-3 text-sm text-roost-600 dark:text-roost-400">
              All rounds complete! Let&apos;s see how you did.
            </p>
            <Button onClick={handleFinish} disabled={loading}>
              See results
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Strut your stuff... share your perspective"
              className="flex-1 rounded-xl border border-roost-300 bg-white px-4 py-2.5 text-sm text-roost-900 placeholder:text-roost-400 focus:border-gobbl-500 focus:outline-none focus:ring-2 focus:ring-gobbl-500/20 dark:border-roost-700 dark:bg-roost-800 dark:text-roost-100 transition-all"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Send
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
