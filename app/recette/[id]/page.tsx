import {TheMealDB} from "@/libs/TheMealDB";
import Image from "next/image";
import TopBar from "@/app/components/ui/TabBar";
import {notFound} from "next/navigation";
import safeFrom from "@/libs/safeFrom";
import Link from "next/link";
import RecipeTabs from "@/app/recette/[id]/RecipeTabs";


export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) {
    const { id } = await params
    const search = await searchParams
    const datas = await TheMealDB.getMealById(id)
    if (!datas) notFound();
    const data = datas[0]

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full z-20">
                <TopBar backUrl={safeFrom(search.from, '/')} />
            </div>

            <div className={"relative top-0 w-full"}>
                <img src={data.thumbnail} alt={data.name} className={"w-full h-[300px] object-cover"} />
                <div className={"absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"} />
                <div className={"absolute left-0 w-full bottom-0 z-20 p-5"}>
                    <h1 className={"text-2xl font-bold mb-2 text-white"}>{data.name}</h1>
                    <p className={"text-sm text-gray-200 mb-4"}>{data.category} - {data.area}</p>
                </div>
            </div>

            <RecipeTabs data={data} />
        </div>
    );
}

