import prisma from "@/libs/db";
import {RateLimiter} from "effect/RateLimiter";
import {rateLimit} from "@/libs/rate-limit";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const MAX_QUERY_LENGTH = 200;

interface WineRow {
    wine_id: number;
    wine_name: string;
    type: string | null;
    country: string | null;
    region_name: string | null;
    winery_name: string | null;
    abv: number | null;
    score: number;
}

export async function GET(request: Request): Promise<Response> {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ok = await rateLimit(ip, 10, 5); // 10 requests per minute
    if (!ok.allowed) {
        return Response.json({ message: 'Too many requests' }, { status: 429 });
    }


    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10);

    if (!query) {
        return Response.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return Response.json({ message: `Query cannot exceed ${MAX_QUERY_LENGTH} characters` }, { status: 400 });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        return Response.json({ message: `limit must be an integer between 1 and ${MAX_LIMIT}` }, { status: 400 });
    }

    try {
        // word_similarity(query, wine_name) scores how well the query matches any word-sequence
        // in the wine name — avoids short names always winning over longer relevant names.
        // DISTINCT ON (wine_name, type) collapses duplicates that differ only by winery/vintage
        // while preserving e.g. "Cabernet Sauvignon Red" vs "Cabernet Sauvignon White".
        // unaccent_immutable() is an IMMUTABLE wrapper around unaccent() required by the GIN index.
        const results = await prisma.$queryRaw<WineRow[]>`
            SELECT wine_id, wine_name, type, country, region_name, winery_name, abv, score
            FROM (
                SELECT DISTINCT ON (unaccent_immutable(wine_name), type)
                    wine_id, wine_name, type, country, region_name, winery_name, abv,
                    word_similarity(unaccent_immutable(${query}), unaccent_immutable(wine_name)) AS score
                FROM "wines"
                WHERE unaccent_immutable(${query}) <% unaccent_immutable(wine_name)
                ORDER BY unaccent_immutable(wine_name), type, word_similarity(unaccent_immutable(${query}), unaccent_immutable(wine_name)) DESC
            ) deduped
            ORDER BY score DESC
            LIMIT ${limit}
        `;
        return Response.json({ results });
    } catch (err) {
        console.error('[api/vin/search] database error:', err);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}
