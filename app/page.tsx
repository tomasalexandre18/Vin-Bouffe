"use client";

import { useState } from "react";

export default function Home() {
  const [wine, setWine] = useState("");
  const [meals, setMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  //  mapping 
  const wineToIngredient = (wine: string) => {
    const w = wine.toLowerCase();

    if (w.includes("rouge")) return "beef";
    if (w.includes("blanc")) return "chicken";
    if (w.includes("rose")) return "salmon";
    if (w.includes("vin")) return "chicken";

    return "chicken"; 
  };

  //  recherche plats
  const searchMeals = async () => {
    if (!wine || wine.trim().length < 2) return;

    setLoading(true);
    setMeals([]);
    setSelectedMeal(null);

    const ingredient = wineToIngredient(wine);

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`
      );

      const data = await res.json();

      setMeals(data.meals || []);
    } catch (err) {
      console.log("Erreur API:", err);
      setMeals([]);
    }

    setLoading(false);
  };

  // détail recette
  const getMealDetails = async (id: string) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      const data = await res.json();
      setSelectedMeal(data.meals?.[0] || null);
    } catch (err) {
      console.log("Erreur detail:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B10] text-white px-6 py-10">

      {/* TITLE */}
      <h1 className="text-5xl text-center font-serif text-[#F2CF93] mb-4">
        Accord 🍷
      </h1>

      <p className="text-center text-[#C39AA8] mb-10">
        Trouve des plats selon ton vin
      </p>

      {/* SEARCH */}
      <div className="flex gap-2 max-w-xl mx-auto mb-10">
        <input
          value={wine}
          onChange={(e) => setWine(e.target.value)}
          placeholder="Ex: vin rouge, vin blanc..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none"
        />

        <button
          onClick={searchMeals}
          className="bg-[#C9476A] px-6 rounded-xl hover:bg-[#8E2342]"
        >
          Go
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-white/60">
          Recherche des accords...
        </p>
      )}

      {/* GRID */}
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
                {meal.strCategory} • {meal.strArea}
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

      {/* DÉTAIL RECETTE */}
      {selectedMeal && (
        <div className="mt-12 max-w-3xl mx-auto bg-[#271320] p-6 rounded-2xl border border-white/10">

          <img
            src={selectedMeal.strMealThumb}
            className="w-full rounded-xl mb-4"
          />

          <h2 className="text-3xl text-[#F2CF93] mb-4">
            {selectedMeal.strMeal}
          </h2>

          <p className="text-white/70 mb-2">
            <b>Catégorie :</b> {selectedMeal.strCategory}
          </p>

          <p className="text-white/70 mb-4">
            <b>Origine :</b> {selectedMeal.strArea}
          </p>

          <h3 className="text-[#C39AA8] mb-2">
            Instructions
          </h3>

          <p className="text-white/80 leading-relaxed whitespace-pre-line">
            {selectedMeal.strInstructions}
          </p>

        </div>
      )}

    </main>
  );
}