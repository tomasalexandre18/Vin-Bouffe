"use client";
import TabBar from "../../components/ui/TabBar";
import {use, useEffect, useState} from "react";
import FullScreenLoading from "@/app/components/ui/FullScreenLoading";
import {MealSummary} from "@/libs/TheMealDB";

const WINE_ICON = {
    Red :"/wineIcon/bouteille-de-vin-rouge.svg",
    White : "/wineIcon/bouteille-de-vin-blanc.svg",
    Rosé : "/wineIcon/bouteille-de-vin-rose.svg" ,
    Sparkling : "/wineIcon/bouteille-de-vin-petillant.svg" ,
} as const;

function readCache(id: string) {
    try {
        const raw = localStorage.getItem(`listdish_${id}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function ListDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const cached = typeof window !== "undefined" ? readCache(id) : null;

    const [showLoader, setShowLoader] = useState(!cached);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [meals, setMeals] = useState<MealSummary[]>(cached?.recommended_meal ?? []);
    const [wine, setWine] = useState<never>(cached?.wine ?? null);


    useEffect(() => {
        if (cached) return;

        (async () => {
            const res = await fetch(`/api/vin/recommendation?wine_id=${id}`);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem(`listdish_${id}`, JSON.stringify(data));
                setMeals(data.recommended_meal);
                setWine(data.wine);
                setFetching(false);
            } else {
                setFetching(false);
                setError("Failed to fetch meals");
            }
        })();
    }, []);

    let imageWine = "";
    if (wine) {
        imageWine = WINE_ICON[wine.type as keyof typeof WINE_ICON] || "/wineIcon/bouteille-de-vin-rouge.svg";
    }

    const loading = showLoader && fetching;

    return (<>
        {showLoader && <FullScreenLoading force={fetching}/>}
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
            {!loading && !error && meals.length === 0 && (
                <div className="text-center mt-4">No recommended meals found for this wine.</div>
            )}
            {!loading && !error && meals.length > 0 && (
          <div className="bg-white">
            <TabBar backUrl={"/"} />
            <div className="flex items-center m-4 gap-2 rounded-xl border-2 border-[#9D1B3F] bg-white p-2 shadow-md">
              <img src={imageWine} />
              <div className="flex flex-col text-lg">
                <h1 className="text-2xl font-bold">{wine.wine_name}</h1>
                <p>{wine.type}</p>
                <p>Country : {wine.country}</p>
                <p>Acidity : {wine.acidity}</p>
              </div>
            </div>
            <hr className="border border-[#D9D9D9] m-4 mt-6"></hr>

            <div>
              <ul className="grid grid-cols-2 gap-6 ml-3 mr-3">
                {meals.map((meal) => (
                    <a href={`/recette/${meal.idMeal}?from=/listdish/${wine.wine_id}`} key={meal.idMeal}>
                      <li className="flex flex-col overflow-hidden rounded-xl shadow-lg ">
                        <p className="text-sm font-medium text-gray-900 ml-2">{meal.strMeal}</p>
                        <img src={meal.strMealThumb} alt={meal.strMeal} className="h-full  w-full object-cover rounded-xl"/>
                      </li>
                    </a>
                ))}
              </ul>
            </div>
          </div>
          )}
        </>
    );
}
