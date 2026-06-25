export default function SlideTabs({
  activeIndex,
  children,
  className = "",
}: {
  activeIndex: number;
  children: React.ReactNode[];
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{
          width: `${children.length * 100}%`,
          transform: `translateX(-${activeIndex * (100 / children.length)}%)`,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="h-full shrink-0 overflow-y-auto"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
