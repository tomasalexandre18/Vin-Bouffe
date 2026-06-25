import prisma from "@/libs/db";
import {TheMealDB} from "@/libs/TheMealDB";
import {shuffleArray} from "@/libs/helper/shuffle";
import {rateLimit} from "@/libs/rate-limit";

export async function GET(request: Request): Promise<Response> {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ok = await rateLimit(ip, 3, 60); // 10 requests per minute
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

    const final_recommended_meal = [];
    for (const map of mapping) {
        const meal = await TheMealDB.getMealsByIngredient(map.the_meal_text);
        if (meal) {
            final_recommended_meal.push(meal["meals"]);
        } else {
            console.log(`No meals found for ingredient: ${map.the_meal_text}`)
        }
    }

    if (final_recommended_meal.length === 0) {
        return Response.json({ message: 'No recommended meals found for this wine' }, { status: 404 })
    }

    const recommended_meal = final_recommended_meal.flat().filter(n => n !== null);
    shuffleArray(recommended_meal);

    return Response.json(recommended_meal);
}