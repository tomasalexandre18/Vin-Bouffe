import Image from "next/image";

type WineCardProps = {
  label: string;
  dotClass: string;
  icon: string;
  descriptions?: readonly string[];
};

export default function WineCard({ label, dotClass, icon, descriptions = [] }: WineCardProps) {
  return (
    <div className="bg-creme rounded-card p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
        <span className="font-sans text-xs font-semibold text-taupe tracking-tag uppercase">{label}</span>
      </div>

      <Image src={icon} alt={label} width={40} height={40} className="self-end opacity-60" />

      <div className="flex flex-col gap-1 mt-auto">
        {descriptions.map((d, i) => (
          <p key={i} className="font-sans text-sm text-prune truncate">{d}</p>
        ))}
      </div>
    </div>
  );
}
