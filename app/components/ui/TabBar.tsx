import Image from "next/image";

export default function TopBar({ backUrl }: { backUrl?: string }) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-bordeaux w-screen p-3 m-0 flex flex-row justify-between items-center rounded-b-lg shadow-lg animate-header-in">
            {/* go back */}
            <a href={backUrl ?? "#"} className={backUrl ? "" : "pointer-events-none"}>
                <Image src="/arrow-left.svg" alt="Back" width={24} height={24} className={backUrl ? "cursor-pointer" : "invisible"} />
            </a>

            <Image src="/winecore.svg" alt="WineCore" width={133} height={25} />

            <Image src="/arrow-left.svg" alt="Back" width={24} height={24} className="invisible" />
        </div>
    );
}