export default function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 w-full px-8">
      <span className="flex-1 h-px bg-bordeaux" />
      <span className="text-sm font-medium tracking-eyebrow text-taupe">{label}</span>
      <span className="flex-1 h-px bg-bordeaux" />
    </div>
  );
}
