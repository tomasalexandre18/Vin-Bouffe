import WineCard from "./components/ui/WineCard";
import BottomSearchBar from "./components/ui/BottomSearchBar";
import Image from "next/image";
import Link from "next/link";

const WINE_FILTERS = [
  {
    label: "Red",
    dotClass: "bg-bordeaux",
    icon: "/wineIcon/bouteille-de-vin-rouge.svg",
    descriptions: ["Bordeaux 2018", "Châteauneuf-du-Pape", "Côtes du Rhône"],
  },
  {
    label: "White",
    dotClass: "bg-sable",
    icon: "/wineIcon/bouteille-de-vin-blanc.svg",
    descriptions: ["Chablis Premier Cru", "Sancerre", "Pouilly-Fumé"],
  },
  {
    label: "Rosé",
    dotClass: "bg-bordeaux-soft",
    icon: "/wineIcon/bouteille-de-vin-rose.svg",
    descriptions: ["Provence Rosé", "Tavel"],
  },
  {
    label: "Sparkling",
    dotClass: "bg-or",
    icon: "/wineIcon/bouteille-de-vin-petillant.svg",
    descriptions: ["Champagne Brut"],
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Hero — bordeaux, overlaps image */}
      <section className="relative bg-bordeaux rounded-b-[2.5rem] px-6 pt-8 pb-10 flex flex-col gap-5 z-20">
        <div className="flex justify-center">
          <Image src="/winecore.svg" alt="WineCore" width={133} height={25} priority />
        </div>
        <Link href="/listdish">
          <h1 className="font-display text-[2.15rem] leading-[1.15] font-semibold text-creme mt-2">
            Which bottle pairs with this meal?
          </h1>
        </Link>
      </section>

      {/* Cards — image vignoble en fond, remonte sous le hero */}
      <section className="relative flex-1 -mt-12 px-4 pb-5 -mb-6">
        <Image
          src="/landing_page.png"
          alt=""
          fill
          unoptimized
          priority
          className="object-cover object-center"
        />
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-20">
          {WINE_FILTERS.map((f) => (
            <WineCard
              key={f.label}
              label={f.label}
              dotClass={f.dotClass}
              icon={f.icon}
              descriptions={f.descriptions}
            />
          ))}
        </div>
      </section>

      <BottomSearchBar />
    </main>
  );
}
