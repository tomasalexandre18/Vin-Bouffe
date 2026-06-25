"use client";

import SlideTabs from "@/app/components/ui/SlideTabs";
import { useState } from "react";
import { Meal } from "@/libs/TheMealDB";

function YoutubeViewer({ url }: { url: string }) {
  function getYoutubeId(url: string) {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") return u.pathname.slice(1);
      return u.searchParams.get("v");
    } catch {
      return null;
    }
  }

  const videoId = getYoutubeId(url);
  if (!videoId) return <p className="font-sans text-sm text-taupe px-6 py-4">URL YouTube invalide</p>;

  return (
    <div className="px-4 py-4" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video player"
        className="w-full h-full rounded-card"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

const TABS = [
  { key: "ingredients", label: "Ingredients" },
  { key: "instructions", label: "Instructions" },
  { key: "video", label: "Video" },
] as const;

export default function RecipeTabs({ data }: { data: Meal }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("ingredients");
  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Tab buttons */}
      <div className="shrink-0 flex gap-3 justify-center py-4 px-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 font-sans text-sm font-medium rounded-pill transition-colors ${
              activeTab === key ? "bg-bordeaux text-creme" : "bg-creme-2 text-bordeaux"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content — each panel scrolls independently */}
      <SlideTabs activeIndex={activeIndex} className="flex-1 min-h-0">
        <div className="px-6 py-2">
          <h2 className="font-display text-xl font-semibold mb-3 text-prune">Ingredients</h2>
          <ul className="flex flex-col gap-2">
            {data.ingredients.map((ingredient, i) => (
              <li key={i} className="font-sans text-sm text-prune flex gap-2">
                <span className="text-taupe shrink-0 w-20 text-right">{ingredient.measure}</span>
                <span>{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-2">
          <h2 className="font-display text-xl font-semibold mb-3 text-prune">Instructions</h2>
          <p className="font-sans text-sm text-prune leading-relaxed whitespace-pre-line">
            {data.instructions}
          </p>
        </div>

        <div className="px-4 py-2">
          {data.youtube
            ? <YoutubeViewer url={data.youtube} />
            : <p className="font-sans text-sm text-taupe text-center py-8">No video available.</p>
          }
        </div>
      </SlideTabs>
    </div>
  );
}
