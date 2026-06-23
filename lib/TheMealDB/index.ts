// Regroupe les différentes FONCTIONS de l'API
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const MealDB = {

  obtenirPlatParId: async (id: string) => {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    return res.json();
  },

filtrerParIngredient: async (ingredient: string) => {
  const res = await fetch(
    `${BASE_URL}/filter.php?i=${ingredient}`
  );

  const data = await res.json();

  return {
    meals: data.meals || []
  };
}

};