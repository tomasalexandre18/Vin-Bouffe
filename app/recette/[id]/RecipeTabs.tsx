"use client";
import SlideTabs from "@/app/components/ui/SlideTabs";
import {useState} from "react";
import {Meal} from "@/libs/TheMealDB";

function YoutubeViewer({ url }: { url: string }) {
    function getYoutubeId(url: string) {
        try {
            const u = new URL(url);
            if (u.hostname === 'youtu.be') return u.pathname.slice(1);
            return u.searchParams.get('v');
        } catch {
            return null;
        }
    }

    const videoId = getYoutubeId(url);

    if (!videoId) return <div>URL YouTube invalide</div>;

    return (
        <div style={{ width: '100%', aspectRatio: '16/9' }}>
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title="YouTube video player"
                style={{ width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
}

export default function RecipeTabs({ data }: { data: Meal}) {
    const tabs = ["ingredients", "instructions", "video"];
    const [activeTab, setActiveTab] = useState("ingredients");

    return (<>

        <div className={"flex flex-wrap w-full gap-4 mb-4 justify-center py-4"}>
            {[["ingredients", "Ingredients"], ["instructions", "Instructions"], ["video", "Video"]].map(([key, label]) => (
                <button
                    key={key}
                    className={`px-5 py-2 text-lg rounded-pill transition-colors ${activeTab === key ? "bg-bordeaux text-creme" : "bg-creme-2 text-bordeaux"}`}
                    onClick={() => setActiveTab(key)}
                >{label}</button>
            ))}
        </div>

        <SlideTabs activeIndex={tabs.indexOf(activeTab)} className={"w-full"}>
            <div className={"px-6 py-4 w-screen"}>
                <h2 className={"text-2xl font-semibold mb-2"}>Ingredients</h2>
                <ul className={"list-disc list-inside mb-4 text-lg"}>
                    {data.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.measure} {ingredient.name}</li>
                    ))}
                </ul>


            </div>
            <div className={"px-6 py-4 w-screen"}>
                <h2 className={"text-2xl font-semibold mb-2"}>Instructions</h2>
                <p className={"text-lg leading-relaxed"}>{data.instructions}</p>
            </div>

            <div className={"flex gap-4 mb-4 justify-center py-4 w-screen"}>
                {data.youtube && <YoutubeViewer url={data.youtube} />}
            </div>
        </SlideTabs>
    </>);
}