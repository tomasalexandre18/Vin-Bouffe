import prisma from "@/libs/db";

export default async function ListDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
      <h1>{wine.wine_name}</h1>
      <p>{wine.type}</p>
    </div>
  );
}