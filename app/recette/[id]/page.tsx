import { TheMealDB } from "@/libs/TheMealDB";
import Image from "next/image";
import { notFound } from "next/navigation";
import RecipeTabs from "@/app/recette/[id]/RecipeTabs";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const datas = await TheMealDB.getMealById(id);
  if (!datas) notFound();
  const data = datas[0];

  return (
    <div className="h-full flex flex-col animate-page-in">
      <div className="relative w-full h-70 shrink-0">
        <Image
          src={data.thumbnail}
          alt={data.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-0 w-full bottom-0 z-10 p-5">
          <h1 className="font-display text-2xl font-semibold mb-1 text-white leading-snug">
            {data.name}
          </h1>
          <p className="font-sans text-sm text-white/70">
            {data.category} · {data.area}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <RecipeTabs data={data} />
      </div>
    </div>
  );
}
