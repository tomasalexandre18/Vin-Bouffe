import prisma from "@/libs/db";
import {TheMealDB} from "@/libs/TheMealDB";
import {shuffleArray} from "@/libs/helper/shuffle";
import {rateLimit} from "@/libs/rate-limit";

export async function GET(request: Request): Promise<Response> {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ok = await rateLimit(ip, 20, 60); // 10 requests per minute
    if (!ok.allowed) {
        return Response.json({ message: 'Too many requests' }, { status: 429 });
    }

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

    const harmonizes= wine.harmonize;
    const mapping = await prisma.mapping_wines_harmonize_the_meal_db.findMany({
        where: {
            harmonize_text: {
                in: harmonizes,
            },
        },
    });

    console.log(mapping, harmonizes);

    const results = await Promise.all(
        mapping.map(map => TheMealDB.getMealsByIngredient(map.the_meal_text))
    );

    const final_recommended_meal = results.flatMap((meals, i) => {
        if (!meals || meals.length === 0) {
            console.log(`No meals found for ingredient: ${mapping[i].the_meal_text}`);
            return [];
        }
        return meals;
    });

    if (final_recommended_meal.length === 0) {
        return Response.json({ message: 'No recommended meals found for this wine' }, { status: 404 })
    }

    shuffleArray(final_recommended_meal);

    return Response.json({recommended_meal: final_recommended_meal, wine: wine});
}