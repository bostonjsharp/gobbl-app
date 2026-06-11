import Parser from "rss-parser";
import { extract } from "@extractus/article-extractor";

export interface NewsStory {
  title: string;
  description: string;
  url: string;
  content: string;
  source: string;
  publishedAt: string;
}

const NPR_RSS = "https://feeds.npr.org/1001/rss.xml";
const BBC_RSS = "http://feeds.bbci.co.uk/news/rss.xml";
const AP_HUB = "https://apnews.com/hub/ap-top-news";
const CONTENT_CAP = 8000;

// AP article URL slugs that indicate sports content — skip these for debate topics
const SPORTS_SLUG_TERMS = [
  "nba", "nfl", "mlb", "nhl", "mls", "ufc",
  "world-cup", "fifa", "super-bowl", "nba-finals", "nfl-playoffs",
  "nascar", "formula-1", "olympics", "paralympics",
  "-golf-", "-tennis-", "-hockey-", "-soccer-", "-basketball-", "-baseball-",
  "patrick-mahomes", "chiefs-", "-chiefs-", "knicks", "spurs", "lakers",
  "infantino", "anunoby", "wbc-pitch",
];

function isSportsUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return SPORTS_SLUG_TERMS.some((term) => lower.includes(term));
}

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

let cache: { date: string; stories: NewsStory[] } | null = null;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchFullContent(url: string): Promise<{ title?: string; description?: string; content: string; publishedAt?: string }> {
  try {
    const article = await extract(url, undefined, {
      signal: AbortSignal.timeout(8000),
      headers: FETCH_HEADERS,
    });
    return {
      title: article?.title ?? undefined,
      description: article?.description ?? undefined,
      content: article?.content ? stripHtml(article.content).slice(0, CONTENT_CAP) : "",
      publishedAt: article?.published ?? undefined,
    };
  } catch {
    return { content: "" };
  }
}

type RawItem = Record<string, string>;

async function fetchRssStories(feedUrl: string, sourceName: string, count: number): Promise<NewsStory[]> {
  const parser = new Parser({
    customFields: { item: [["content:encoded", "contentEncoded"]] },
  });

  const feed = await parser.parseURL(feedUrl);
  const items = feed.items.filter((item) => item.link && item.title).slice(0, count);

  return Promise.all(
    items.map(async (item) => {
      const rawRss =
        (item as unknown as RawItem).contentEncoded ||
        item.content ||
        item.summary ||
        item.contentSnippet ||
        "";
      const rssFallback = stripHtml(rawRss).slice(0, 2000);
      const description = stripHtml(item.contentSnippet || item.summary || rawRss).slice(0, 300);

      const fetched = item.link ? await fetchFullContent(item.link) : { content: "" };

      return {
        title: item.title ?? "",
        description,
        url: item.link ?? "",
        content: fetched.content || rssFallback || description,
        source: sourceName || feed.title || "News",
        publishedAt: item.pubDate ?? item.isoDate ?? "",
      };
    }),
  );
}

async function fetchApStories(count: number): Promise<NewsStory[]> {
  const res = await fetch(AP_HUB, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const html = await res.text();

  // Extract article URLs directly — AP's hub page includes them in JSON-LD and data attributes
  const articleUrls: string[] = [];
  const urlPattern = /"url":"(https:\/\/apnews\.com\/article\/[^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = urlPattern.exec(html)) !== null) {
    const url = m[1];
    if (!articleUrls.includes(url) && !isSportsUrl(url)) articleUrls.push(url);
    if (articleUrls.length >= count + 5) break; // gather extras in case some fail
  }

  const results: NewsStory[] = [];
  for (const url of articleUrls) {
    if (results.length >= count) break;
    const fetched = await fetchFullContent(url);
    if (!fetched.content || !fetched.title) continue;
    results.push({
      title: fetched.title,
      description: fetched.description ? fetched.description.slice(0, 300) : fetched.content.slice(0, 300),
      url,
      content: fetched.content,
      source: "AP News",
      publishedAt: fetched.publishedAt ?? "",
    });
  }

  return results;
}

export async function getDailyStories(): Promise<NewsStory[]> {
  const today = todayKey();
  if (cache && cache.date === today) return cache.stories;

  // AP is primary (up to 3); NPR and BBC fill in if AP comes up short
  const [apResult, nprResult, bbcResult] = await Promise.allSettled([
    fetchApStories(3),
    fetchRssStories(NPR_RSS, "NPR", 2),
    fetchRssStories(BBC_RSS, "BBC News", 2),
  ]);

  const apStories = apResult.status === "fulfilled" ? apResult.value : [];
  const backups = [
    ...(nprResult.status === "fulfilled" ? nprResult.value : []),
    ...(bbcResult.status === "fulfilled" ? bbcResult.value : []),
  ];

  const stories: NewsStory[] = [
    ...apStories,
    ...backups.slice(0, Math.max(0, 3 - apStories.length)),
  ].slice(0, 3);

  cache = { date: today, stories };
  return stories;
}
