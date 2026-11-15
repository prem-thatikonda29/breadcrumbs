import { NextRequest } from "next/server";

// Fetches a site's icon server-side so the reader's browser never contacts the icon service.
// DuckDuckGo answers unknown domains with a 404 + placeholder image; we pass back an empty 404
// instead, so the <img> errors and the client shows its letter tile.
const HOST = /^(?=.{1,253}$)[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const WEEK = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get("host")?.toLowerCase() ?? "";
  if (!HOST.test(host)) return new Response(null, { status: 400 });

  try {
    const res = await fetch(`https://icons.duckduckgo.com/ip3/${host}.ico`, {
      signal: AbortSignal.timeout(5000),
    });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) {
      return new Response(null, { status: 404, headers: { "Cache-Control": `private, max-age=${WEEK}` } });
    }
    return new Response(res.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": `private, max-age=${WEEK}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
