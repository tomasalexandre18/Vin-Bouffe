type FilterPillProps = {
  label: string;
  dotClass: string;
};

export default function FilterPill({ label, dotClass }: FilterPillProps) {
  return (
    <button className="flex flex-col items-center justify-center gap-1.5 w-full py-2.5 bg-creme rounded-pill text-xs font-medium text-prune hover:bg-or-soft transition-colors cursor-pointer">
      <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
      {label}
    </button>
  );
}
