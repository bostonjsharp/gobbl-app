import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLevelInfo } from "@/lib/gamification";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: true,
      debates: {
        where: { completed: true },
        orderBy: { completedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const levelInfo = getLevelInfo(user.xp);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const dailyDebateToday = await prisma.debate.findFirst({
    where: {
      userId,
      isDaily: true,
      createdAt: { gte: todayStart, lt: todayEnd },
    },
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    xp: user.xp,
    level: user.level,
    levelInfo,
    civilityScore: user.civilityScore,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    dailyCompleted: !!dailyDebateToday,
    badges: user.badges.map((b) => b.badgeKey),
    recentDebates: user.debates.map((d) => ({
      id: d.id,
      topic: d.topic,
      category: d.category,
      difficulty: d.difficulty,
      score: d.overallScore,
      xpEarned: d.xpEarned,
      completedAt: d.completedAt,
    })),
    createdAt: user.createdAt,
  });
}
