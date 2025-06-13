import {getPrints} from "@/lib/data";
import {getFeed} from "@/lib/data/feed";

export const dynamic = 'force-static'

export async function GET() {
    const feed = await getFeed();
    return new Response(feed.rss2(), {headers: { 'Content-Type': 'application/rss+xml'}})
}
