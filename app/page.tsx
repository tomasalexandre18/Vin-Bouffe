import FilterPill from "./components/ui/FilterPill";
import SearchBar from "./components/ui/SearchBar";
import Divider from "./components/ui/Divider";
import Image from "next/image";

const WINE_FILTERS = [
  { label: "Red",      dotClass: "bg-bordeaux" },
  { label: "White",    dotClass: "bg-sable" },
  { label: "Rosé",     dotClass: "bg-bordeaux-soft" },
  { label: "Sparkling", dotClass: "bg-or" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">
      {/* Hero */}
      <section className="bg-bordeaux rounded-b-[2.5rem] px-6 pt-3 pb-5 flex flex-col gap-7 grow-2 basis-0 z-20">
        {/* Logo */}
        <div className="flex justify-center pt-3 grow basis-0 items-start">
          <Image src="/winecore.svg" alt="WineCore" width={133} height={25} />
        </div>

        {/* Heading */}
        <h1 className="font-display text-[2.15rem] leading-[1.15] font-semibold text-creme">
          Which bottle pairs with this meal?
        </h1>

        {/* Search */}
        <SearchBar />

        {/* Filters */}
        <div className="grid grid-cols-4 gap-2">
          {WINE_FILTERS.map((f) => (
            <FilterPill key={f.label} label={f.label} dotClass={f.dotClass} />
          ))}
        </div>
      </section>

      {/* Bottom (OR + CTA) */}
      <div className="flex flex-col flex-end overflow-hidden justify-center grow-2 basis-0 gap-2">
        <Image
          src="/landing_page.png"
          alt=""
          fill
          unoptimized
          className="object-cover object-bottom"
        />
        <div className="inset-0 bg-bg/60"></div>

        {/* OR divider */}
        <div className="relative z-10 py-10">
          <Divider label="OR" />
        </div>

        {/* CTA */}
        <div className="relative z-10 px-6 pb-12 flex items-end">
          <button className="w-full py-4 rounded-pill bg-bordeaux text-creme font-medium text-base hover:bg-bordeaux-deep transition-colors cursor-pointer">
            Scan my bottle
          </button>
        </div>
      </div>
    </main>
  );
}
