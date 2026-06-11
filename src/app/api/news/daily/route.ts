import { NextResponse } from "next/server";
import { getDailyStories } from "@/lib/news";

export const revalidate = 3600;

export async function GET() {
  try {
    const stories = await getDailyStories();
    return NextResponse.json({ stories });
  } catch (err) {
    console.error("Failed to fetch daily news stories:", err);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}
