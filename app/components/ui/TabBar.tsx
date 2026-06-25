import Image from "next/image";

export default function TopBar({ backUrl }: { backUrl?: string }) {
    return (
        <div className="bg-bordeaux w-screen p-3 m-0 top-0 left-0 flex flex-row justify-between items-center rounded-b-lg shadow-lg">
            {/* go back */}
            <a href={backUrl ?? "#"} className={backUrl ? "" : "pointer-events-none"}>
                <Image src="/arrow-left.svg" alt="Back" width={24} height={24} className={backUrl ? "cursor-pointer" : "invisible"} />
            </a>

            <Image src="/winecore.svg" alt="WineCore" width={133} height={25} />

            <Image src="/arrow-left.svg" alt="Back" width={24} height={24} className="invisible" />
        </div>
    );
}