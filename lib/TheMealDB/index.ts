const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const TheMealDB = {
  getMealsByIngredient: async (ingredient: string) => {
    const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
    const data: {
      meals: {
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
      }[] | null;
    } = await res.json();

    return data;
  },

  getMealById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: {
      meals: {
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
        strInstructions: string;
        strCategory: string;
        strArea: string;
      }[] | null;
    } = await res.json();

    return data;
  }
};