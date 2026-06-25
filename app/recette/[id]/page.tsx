import {TheMealDB} from "@/libs/TheMealDB";
import Image from "next/image";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const datas = await TheMealDB.getMealById(id)
    if (!datas) return null;
    const data = datas[0]

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", fontFamily: "sans-serif" }}>
            <h1>{data.name}</h1>
            {data.alternateName && <p><em>Alt: {data.alternateName}</em></p>}

            <Image src={data.thumbnail} alt={data.name} style={{ width: "100%", borderRadius: 8 }} />

            <dl>
                <dt><strong>ID</strong></dt>
                <dd>{data.id}</dd>

                <dt><strong>Catégorie</strong></dt>
                <dd>{data.category}</dd>

                <dt><strong>Zone</strong></dt>
                <dd>{data.area}</dd>

                <dt><strong>Pays</strong></dt>
                <dd>{data.country}</dd>

                <dt><strong>Tags</strong></dt>
                <dd>{data.tags.length > 0 ? data.tags.join(", ") : "—"}</dd>

                <dt><strong>YouTube</strong></dt>
                <dd>
                    {data.youtube ? (
                        <a href={data.youtube} target="_blank" rel="noreferrer">{data.youtube}</a>
                    ) : "—"}
                </dd>

                <dt><strong>Source</strong></dt>
                <dd>
                    {data.source ? (
                        <a href={data.source} target="_blank" rel="noreferrer">{data.source}</a>
                    ) : "—"}
                </dd>

                <dt><strong>Image source</strong></dt>
                <dd>
                    {data.imageSource ? (
                        <a href={data.imageSource} target="_blank" rel="noreferrer">{data.imageSource}</a>
                    ) : "—"}
                </dd>
            </dl>

            <h2>Ingrédients</h2>
            <ul>
                {data.ingredients.map((ing, i) => (
                    <li key={i}>
                        {ing.measure ? `${ing.measure} — ` : ""}{ing.name}
                    </li>
                ))}
            </ul>

            <h2>Instructions</h2>
            <p style={{ whiteSpace: "pre-line" }}>{data.instructions}</p>
        </div>
    );
}