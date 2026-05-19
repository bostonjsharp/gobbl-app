interface ModuleCardProps {
  emoji: string;
  title: string;
  description: string;
  size?: "lg" | "md" | "wide";
}

export function ModuleCard({ emoji, title, description, size = "md" }: ModuleCardProps) {
  const sizeClasses =
    size === "lg"
      ? "col-span-2 min-h-[160px]"
      : size === "wide"
        ? "col-span-2 min-h-[100px]"
        : "min-h-[140px]";
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-roost-100 p-md ${sizeClasses}`}
    >
      <div className="absolute right-2 top-2 rounded-full bg-golden-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-roost-700">
        Coming soon
      </div>
      <div className="text-4xl">{emoji}</div>
      <div>
        <h3 className="font-display font-bold text-roost-700">{title}</h3>
        <p className="text-xs text-roost-500">{description}</p>
      </div>
    </div>
  );
}
