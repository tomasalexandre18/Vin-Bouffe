import Image from "next/image";

export default function TopBar() {
    return (
        <div className="bg-bordeaux w-screen p-3 m-0 top-0 left-0 flex flex-row justify-between items-center rounded-b-[0.5rem]">
            {/* go back */}
            <Image src="/arrow-left.svg" alt="Back" width={24} height={24} />

            <Image src="/winecore.svg" alt="WineCore" width={133} height={25} />

            <Image src="/arrow-left.svg" alt="Back" width={24} height={24} className="invisible" />
        </div>
    );
}