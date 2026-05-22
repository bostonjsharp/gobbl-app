/**
 * The setup route is now consolidated into /chat (one combined screen for
 * topic + difficulty). Keep a thin redirect so any old links keep working.
 *
 * If you'd rather delete this file, also delete the `chat/setup/` folder
 * after confirming no callers reference `/chat/setup`.
 */
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectInner() {
  const router = useRouter();
  const search = useSearchParams();
  useEffect(() => {
    const qs = search.toString();
    router.replace(`/chat${qs ? `?${qs}` : ""}`);
  }, [router, search]);
  return null;
}

export default function LegacySetupRedirect() {
  return <Suspense fallback={null}><RedirectInner /></Suspense>;
}
