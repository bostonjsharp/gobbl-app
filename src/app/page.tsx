"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TurkeyAvatar } from "@/components/gamification/TurkeyAvatar";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"landing" | "login" | "register">("landing");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-4xl animate-wiggle inline-block">🥚</span>
      </div>
    );
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      await signIn("credentials", { username, password, redirect: false });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  if (mode === "landing") {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
          <div className="animate-fade-in text-center max-w-3xl">
            <div className="mb-6 relative inline-block">
              <div className="animate-float">
                <TurkeyAvatar level={5} size="xl" />
              </div>
            </div>

            <h1 className="mb-3 text-5xl font-extrabold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-gobbl-500 via-gobbl-600 to-plume-500 bg-clip-text text-transparent">
                Gobbl
              </span>
            </h1>
            <p className="mb-2 text-2xl font-semibold text-roost-700 dark:text-roost-300 sm:text-3xl">
              Talk turkey. Build bridges.
            </p>
            <p className="mx-auto mb-10 max-w-lg text-lg text-roost-500 dark:text-roost-400">
              Practice civil political discourse with AI. Grow your turkey from an Egg to a Thunderbird as you master respectful debate.
            </p>

            <div className="mb-14 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => setMode("register")}>
                🥚 Hatch Your Turkey
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setMode("login")}>
                Welcome Back
              </Button>
            </div>

            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
              <FeatureCard
                icon="🦃"
                title="Grow Your Turkey"
                description="Start as an Egg and evolve through 8 stages as your discourse skills improve"
              />
              <FeatureCard
                icon="🪶"
                title="Earn Feathers"
                description="Get scored on civility and earn feathers for respectful, evidence-based debate"
              />
              <FeatureCard
                icon="👑"
                title="Lead the Flock"
                description="Collect badges, maintain streaks, and climb the leaderboard"
              />
            </div>

            <div className="mt-14">
              <p className="text-sm text-roost-400 mb-3">From Egg to Thunderbird</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                  <TurkeyAvatar key={lvl} level={lvl} size="sm" animate={false} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-roost-200 py-6 text-center text-sm text-roost-500 dark:border-roost-800">
          <span className="inline-flex items-center gap-2">
            <span>🦃</span>
            Gobbl — Talk turkey. Build bridges.
          </span>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mb-3">
            <TurkeyAvatar level={mode === "register" ? 1 : 3} size="md" />
          </div>
          <h2 className="text-2xl font-bold text-roost-900 dark:text-roost-50">
            {mode === "login" ? "Welcome Back to the Roost" : "Hatch Your Account"}
          </h2>
          <p className="mt-1 text-sm text-roost-500">
            {mode === "login" ? "Your flock missed you!" : "Every Thunderbird starts as an Egg"}
          </p>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Pick a name for your turkey"
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />
          {error && (
            <p className="text-sm text-plume-500">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Hatching..."
              : mode === "login"
                ? "Return to Roost"
                : "🥚 Hatch My Account"
            }
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-roost-500">
          {mode === "login" ? "New to the flock? " : "Already roosting? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="font-semibold text-gobbl-600 hover:underline"
          >
            {mode === "login" ? "Hatch an account" : "Sign in"}
          </button>
        </p>

        <button
          onClick={() => setMode("landing")}
          className="mt-4 block w-full text-center text-sm text-roost-400 hover:text-roost-600 transition-colors"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-roost-200 bg-white p-6 text-center dark:border-roost-800 dark:bg-roost-900 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-gobbl-300 dark:hover:border-gobbl-700">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="mb-1 font-bold text-roost-800 dark:text-roost-100">{title}</h3>
      <p className="text-sm text-roost-500 leading-relaxed">{description}</p>
    </div>
  );
}
