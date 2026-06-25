"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type WineResult = {
  wine_id: number;
  wine_name: string;
  type: string | null;
  winery_name: string | null;
  country: string | null;
};

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-spin" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WineItem({ wine }: { wine: WineResult }) {
  const meta = [wine.type, wine.country].filter(Boolean).join(" · ");
  return (
    <li className="border-b border-line-l last:border-0">
      <Link
        href={`/listdish/${wine.wine_id}`}
        className="flex items-center gap-3 px-5 py-3.5 hover:bg-creme transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-prune truncate">{wine.wine_name}</p>
          {meta && <p className="text-xs text-taupe truncate">{meta}</p>}
        </div>
        <span className="text-or shrink-0 text-base" aria-hidden>›</span>
      </Link>
    </li>
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WineResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/vin/search?query=${encodeURIComponent(query.trim())}&limit=6`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.results ?? []);
        setIsOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const showEmpty = isOpen && !isLoading && query.trim() && results.length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search a wine..."
          aria-label="Search a wine"
          className="w-full px-5 py-3.5 pr-14 rounded-pill bg-creme text-prune placeholder:text-taupe text-sm outline-none focus:ring-2 focus:ring-or/50 border-2 border-or caret-or selection:bg-or/30"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-or pointer-events-none">
          {isLoading ? <IconSpinner /> : <IconSearch />}
        </span>
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-card shadow-lg overflow-hidden z-20"
        >
          {results.map((wine) => (
            <WineItem key={wine.wine_id} wine={wine} />
          ))}
        </ul>
      )}

      {showEmpty && (
        <div
          role="status"
          className="absolute bottom-full left-0 right-0 mb-2 bg-card rounded-card shadow-lg px-5 py-4 z-20"
        >
          <p className="font-sans text-sm text-taupe">No wine found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
