import prisma from "@/libs/db";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    if (limit > 20) {
        return Response.json({ message: 'Limit cannot exceed 20' }, { status: 400 })
    }

    if (!query) {
        return Response.json({ message: 'Query parameter is required' }, { status: 400 })
    }

    const results = await prisma.$queryRaw`
      SELECT *, similarity(unaccent(wine_name), unaccent(${query})) AS score
      FROM "wines"
      WHERE unaccent(wine_name) % unaccent(${query})
      ORDER BY score DESC
      LIMIT ${limit}
    `;

    return Response.json({ results });
}