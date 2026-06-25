import prisma from "@/libs/db";
import TabBar from "../../components/ui/TabBar";

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
    { cache: "no-store" }
  );
  const meals = await res.json();


  const wine = await prisma.wines.findUnique({
    where: {
      wine_id: Number(id),
    },
  });



  if (!wine) {
    return <h1>Wine not found</h1>;
  }

  return (
    <div>
      <TabBar />
      <div>
      <h1>{wine.wine_name}</h1>
      <p>{wine.type}</p>
      </div>

      <div>
        <ul>
          {meals.map((meal: any) => (
            <li key={meal.idMeal}>
              <p>{meal.strMeal}</p>
              <img src={meal.strMealThumb} alt={meal.strMeal} className=""/>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}