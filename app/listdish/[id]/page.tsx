import prisma from "@/libs/db";
import TabBar from "../../components/ui/TabBar";
import Image from 'next/image'
import { notFound } from "next/navigation";
import SearchBar from "../../components/ui/SearchBar";

export default async function ListDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //recommandation
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(
    `${baseUrl}/api/vin/recommendation?wine_id=${id}`,
  );
  const meals = await res.json();


  const wine = await prisma.wines.findUnique({
    where: {
      wine_id: Number(id),
    },
  });

  const WINE_ICON = {
    Red :"/wineIcon/bouteille-de-vin-rouge.svg",
    White : "/wineIcon/bouteille-de-vin-blanc.svg",
    Rosé : "/wineIcon/bouteille-de-vin-rose.svg" ,
    Sparkling : "/wineIcon/bouteille-de-vin-petillant.svg" ,
   } as const;




  if (!wine) {
     notFound()
  }
    const imageWine = WINE_ICON[wine.type as keyof typeof WINE_ICON];

  return (
    <div className="bg-white">
      <TabBar />
      <div className="flex items-center m-4 gap-2 rounded-xl border-2 border-[#9D1B3F] bg-white p-2 shadow-md">
        <img src={imageWine} />
        <div className="flex flex-col text-lg">
          <h1 className="text-2xl">{wine.wine_name}</h1>
          <p>{wine.type}</p>
          <p>Country : {wine.country}</p>
          <p>Acidity : {wine.acidity}</p>
        </div>
      </div>
      <hr className="border border-[#D9D9D9] m-4 mt-6"></hr>
      
      <div>
        <ul className="grid grid-cols-2 gap-6 ml-3 mr-3">
          {meals.map((meal: any) => (
            <li key={meal.idMeal} className="flex flex-col overflow-hidden rounded-xl shadow-lg ">
              <p className="text-sm font-medium text-gray-900 ml-2">{meal.strMeal}</p>
              <img src={meal.strMealThumb} alt={meal.strMeal} className="h-full  w-full object-cover rounded-xl"/>
            </li>
          ))}
        </ul>
      </div>
      <SearchBar/>

    </div>
  );
}