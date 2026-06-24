import prisma from "@/libs/db";
import {TheMealDB} from "@/libs/TheMealDB";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url)
    const wine_id = searchParams.get('wine_id')
    if (!wine_id || isNaN(parseInt(wine_id, 10))) {
        return Response.json({ message: 'wine_id parameter is required' }, { status: 400 })
    }

    const wine = await prisma.wines.findUnique({
        where: { wine_id: parseInt(wine_id, 10) },
    });

    if (!wine) {
        return Response.json({ message: 'Wine not found' }, { status: 404 })
    }

    const harmonizes= wine.harmonize.map(h => h.toLowerCase());
    const mapping = await prisma.mapping_wines_harmonize_the_meal_db.findMany({
        where: {
            harmonize_text: {
                in: harmonizes,
            },
        },
    });
    const recommended_meal = await TheMealDB.getMealsByIngredient(mapping[0].the_meal_text);

    return Response.json(recommended_meal);
}