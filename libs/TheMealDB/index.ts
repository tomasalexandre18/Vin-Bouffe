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

interface MealRaw {
    idMeal: string;
    strMeal: string;
    strMealAlternate: string | null;
    strCategory: string;
    strArea: string;
    strCountry: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string | null;
    strYoutube: string | null;
    strSource: string | null;
    strImageSource: string | null;
    strCreativeCommonsConfirmed: string | null;
    dateModified: string | null;
    [key: `strIngredient${number}`]: string | null;
    [key: `strMeasure${number}`]: string | null;
}

interface Ingredient {
    name: string;
    measure: string;
}

export interface Meal {
    id: string;
    name: string;
    alternateName: string | null;
    category: string;
    area: string;
    country: string;
    instructions: string;
    thumbnail: string;
    tags: string[];
    youtube: string | null;
    source: string | null;
    imageSource: string | null;
    ingredients: Ingredient[];
}

function normalizeMeal(raw: MealRaw): Meal {
    const ingredients: Ingredient[] = [];

    for (let i = 1; i <= 20; i++) {
        const name = raw[`strIngredient${i}`];
        const measure = raw[`strMeasure${i}`];
        if (name && name.trim() !== "") {
            ingredients.push({ name: name.trim(), measure: (measure ?? "").trim() });
        }
    }

    return {
        id: raw.idMeal,
        name: raw.strMeal,
        alternateName: raw.strMealAlternate,
        category: raw.strCategory,
        area: raw.strArea,
        country: raw.strCountry,
        instructions: raw.strInstructions,
        thumbnail: raw.strMealThumb,
        tags: raw.strTags ? raw.strTags.split(",") : [],
        youtube: raw.strYoutube,
        source: raw.strSource,
        imageSource: raw.strImageSource,
        ingredients,
    };
}

function normalizeMealResponse(response: { meals: MealRaw[] }): Meal[] {
    return response.meals.map(normalizeMeal);
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

    getMealById: async (id: string) => {
        const data = await fetchJSON<{ meals: MealRaw[] }>(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
        if (!data.meals) {
            return null;
        }
        return normalizeMealResponse(data)
    }
};
