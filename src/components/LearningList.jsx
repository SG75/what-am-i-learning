import LearningCard from "./LearningCard";

export default function LearningList({
  items,
  onDelete,
  onCycleStatus,
  activeFilter,
}) {
  if (items.length === 0) {
    const isFiltered = activeFilter && activeFilter !== "all";
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-4xl">
          🌱
        </div>
        <p className="text-lg font-semibold text-white/75">
          {isFiltered ? "Nothing matches this filter" : "Nothing here yet"}
        </p>
        <p className="mt-1.5 text-base text-white/40">
          {isFiltered
            ? "Try a different status filter above."
            : "Add your first learning item using the form above."}
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <LearningCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          onCycleStatus={onCycleStatus}
          index={index}
        />
      ))}
    </ul>
  );
}
