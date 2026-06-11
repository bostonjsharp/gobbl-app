import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "fallback-dev-secret");

export async function signMobileToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getMobileSession(
  req: NextRequest | Request
): Promise<{ user: { id: string } } | null> {
  // Try NextAuth session first (web app flow)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return session as unknown as { user: { id: string } };
  }

  // Fall back to Bearer token (mobile app flow)
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub;
    if (!userId) return null;
    return { user: { id: userId } };
  } catch {
    return null;
  }
}
