const BASE_URL = process.env.THEMEALDB_BASE_URL ?? "https://www.themealdb.com/api/json/v1/1";

export interface MealSummary {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

export interface MealDetail extends MealSummary {
    strInstructions: string;
    strCategory: string;
    strArea: string;
}

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`TheMealDB responded with ${res.status}`);
    return res.json() as Promise<T>;
}

export const TheMealDB = {
    getMealsByIngredient: (ingredient: string) =>
        fetchJSON<{ meals: MealSummary[] | null }>(
            `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
        ),

    getMealById: (id: string) =>
        fetchJSON<{ meals: MealDetail[] | null }>(
            `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`
        ),
};
