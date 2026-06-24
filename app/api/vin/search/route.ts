import prisma from "@/libs/db";

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
        // Uses pg_trgm for fuzzy matching + unaccent for accent-insensitive comparison.
        // $queryRaw tagged template parameterizes all values — never switch to $queryRawUnsafe with user input.
        const results = await prisma.$queryRaw<WineRow[]>`
            SELECT
                wine_id, wine_name, type, country, region_name, winery_name, abv,
                similarity(unaccent(wine_name), unaccent(${query})) AS score
            FROM "wines"
            WHERE unaccent(wine_name) % unaccent(${query})
            ORDER BY score DESC
            LIMIT ${limit}
        `;
        return Response.json({ results });
    } catch (err) {
        console.error('[api/vin/search] database error:', err);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}
