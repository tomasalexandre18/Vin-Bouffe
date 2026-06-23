"use client";

import { MealDB } from "@/lib/TheMealDB";
import { useState } from "react";

export default function Home() {
  const [ingredient, setIngredient] = useState("");
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchMeals = async () => {
    if (!ingredient || ingredient.trim().length < 2) return;

    setLoading(true);
    setMeals([]);
    setSelectedMeal(null);

    try {
      const data = await MealDB.filtrerParIngredient(
        ingredient.trim().toLowerCase()
      );

      setMeals(data.meals || []);
    } catch (err) {
      console.log("Erreur API :", err);
      setMeals([]);
    }

    setLoading(false);
  };

  const getMealDetails = async (id: string) => {
    try {
      const data = await MealDB.obtenirPlatParId(id);
      setSelectedMeal(data.meals?.[0] || null);
    } catch (err) {
      console.log("Erreur detail:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B10] text-white px-6 py-10">

      <h1 className="text-5xl text-center font-serif text-[#F2CF93] mb-4">
        Recherche de recettes
      </h1>

      <p className="text-center text-[#C39AA8] mb-10">
        Recherche par ingrédient
      </p>

      <div className="flex gap-2 max-w-xl mx-auto mb-10">
        <input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Ex: chicken, beef, garlic..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
        />

        <button
          onClick={searchMeals}
          className="bg-[#C9476A] px-6 rounded-xl hover:bg-[#8E2342]"
        >
          Go
        </button>
      </div>

      {loading && (
        <p className="text-center text-white/60">
          Chargement...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          >

            <img
              src={meal.strMealThumb}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col gap-3 flex-1">

              <h2 className="text-xl font-serif text-[#F2CF93]">
                {meal.strMeal}
              </h2>

              <p className="text-sm text-white/60">
                ID : {meal.idMeal}
              </p>

              <button
                onClick={() => getMealDetails(meal.idMeal)}
                className="mt-auto bg-[#C9476A] py-2 rounded-xl hover:bg-[#8E2342]"
              >
                Voir recette
              </button>

            </div>
          </div>
        ))}

      </div>

      {selectedMeal && (
        <div className="mt-12 max-w-3xl mx-auto bg-[#271320] p-6 rounded-2xl border border-white/10">

          <img
            src={selectedMeal.strMealThumb}
            className="w-full rounded-xl mb-4"
          />

          <h2 className="text-3xl text-[#F2CF93] mb-4">
            {selectedMeal.strMeal}
          </h2>

          <p>
            Catégorie : {selectedMeal.strCategory}
          </p>

          <p>
            Origine : {selectedMeal.strArea}
          </p>

          <p className="mt-4 whitespace-pre-line">
            {selectedMeal.strInstructions}
          </p>

        </div>
      )}

    </main>
  );
}