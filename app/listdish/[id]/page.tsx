"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FullScreenLoading from "@/app/components/ui/FullScreenLoading";
import BottomSearchBar from "@/app/components/ui/BottomSearchBar";
import { MealSummary } from "@/libs/TheMealDB";

type Wine = {
  wine_id: number;
  wine_name: string;
  type: keyof typeof WINE_ICON;
  country: string | null;
  acidity: string | null;
};

const WINE_ICON = {
  Red: "/wineIcon/bouteille-de-vin-rouge.svg",
  White: "/wineIcon/bouteille-de-vin-blanc.svg",
  Rosé: "/wineIcon/bouteille-de-vin-rose.svg",
  Sparkling: "/wineIcon/bouteille-de-vin-petillant.svg",
} as const;

const WINE_DOT: Record<keyof typeof WINE_ICON, string> = {
  Red: "bg-bordeaux",
  White: "bg-sable",
  Rosé: "bg-bordeaux-soft",
  Sparkling: "bg-or",
};

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

  // All state starts SSR-safe (no localStorage during render → no hydration mismatch)
  const [fetching, setFetching] = useState(true);
  const [loaderDuration, setLoaderDuration] = useState(3750);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [wine, setWine] = useState<Wine | null>(null);

  useEffect(() => {
    const cached = readCache(id);
    if (cached) {
      setMeals(cached.recommended_meal ?? []);
      setWine(cached.wine ?? null);
      setLoaderDuration(0); // exit loader immediately when cache hit
      setFetching(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/vin/recommendation?wine_id=${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        localStorage.setItem(`listdish_${id}`, JSON.stringify(data));
        setMeals(data.recommended_meal);
        setWine(data.wine);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Could not load recommendations. Please try again.");
        }
      } finally {
        setFetching(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const dotClass = wine ? (WINE_DOT[wine.type] ?? "bg-bordeaux") : "bg-bordeaux";
  const iconSrc = wine ? (WINE_ICON[wine.type] ?? WINE_ICON.Red) : WINE_ICON.Red;

  return (
    <>
      <FullScreenLoading force={fetching} minDuration={loaderDuration} />

      <BottomSearchBar />
      <div className="min-h-screen bg-bg flex flex-col pt-14 pb-28">
        {error && (
          <div className="flex-1 flex items-center justify-center px-6 animate-page-in">
            <p className="font-sans text-sm text-taupe text-center">{error}</p>
          </div>
        )}

        {!error && wine && (
          <div className="animate-page-in">
            {/* Wine info card */}
            <div className="px-4 pt-5 pb-2">
              <div className="bg-card rounded-card shadow-sm p-4 flex items-center gap-4 border border-line-l">
                <div className="relative w-16 h-16 shrink-0">
                  <Image src={iconSrc} alt={wine.type} fill className="object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                    <span className="font-sans text-[0.65rem] font-semibold text-taupe tracking-tag uppercase">
                      {wine.type}
                    </span>
                  </div>

                  <h1 className="font-display text-xl font-semibold text-prune leading-snug">
                    {wine.wine_name}
                  </h1>

                  <div className="flex flex-wrap gap-x-3 mt-1.5">
                    {wine.country && (
                      <span className="font-sans text-xs text-taupe">{wine.country}</span>
                    )}
                    {wine.acidity && (
                      <span className="font-sans text-xs text-taupe">
                        Acidity · {wine.acidity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended dishes */}
            {meals.length > 0 && (
              <section className="px-4 pt-5 pb-10">
                <h2 className="font-display text-lg font-semibold text-prune mb-3">
                  Recommended dishes
                </h2>

                <ul className="grid grid-cols-2 gap-3">
                  {meals.map((meal) => (
                    <li key={meal.idMeal}>
                      <Link href={`/recette/${meal.idMeal}?from=/listdish/${wine.wine_id}`}>
                        <div className="relative overflow-hidden rounded-card aspect-square shadow-sm">
                          <Image
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            fill
                            sizes="(max-width: 480px) 50vw, 200px"
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                          <p className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 font-sans text-xs font-semibold text-white leading-tight line-clamp-2">
                            {meal.strMeal}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {meals.length === 0 && !fetching && (
              <div className="flex-1 flex items-center justify-center px-6 py-20">
                <p className="font-sans text-sm text-taupe text-center">
                  No recommended dishes found for this wine.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
