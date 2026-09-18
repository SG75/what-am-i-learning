import { useState } from "react";
const statusConfig = {
  learning: {
    bar: "from-emerald-400 via-teal-400 to-cyan-400",
    tint: "bg-emerald-500/[0.08]",
    hoverBorder: "hover:border-emerald-400/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgba(52,211,153,0.4)]",
    badge: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200",
    dot: "bg-emerald-400",
  },
  "yet to start": {
    bar: "from-amber-400 via-orange-400 to-rose-400",
    tint: "bg-amber-500/[0.08]",
    hoverBorder: "hover:border-amber-400/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgba(251,191,36,0.4)]",
    badge: "border-amber-400/30 bg-amber-400/15 text-amber-200",
    dot: "bg-amber-400",
  },
  done: {
    bar: "from-sky-400 via-blue-400 to-indigo-400",
    tint: "bg-sky-500/[0.08]",
    hoverBorder: "hover:border-sky-400/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgba(56,189,248,0.4)]",
    badge: "border-sky-400/30 bg-sky-400/15 text-sky-200",
    dot: "bg-sky-400",
  },
};

const fallback = statusConfig["yet to start"];

export default function LearningCard({
  item,
  onDelete,
  onCycleStatus,
  onUpdate,
  index = 0,
}) {
  const status = statusConfig[item.status] || fallback;
  const [isEditing, setIsEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState(item.notes || "");
  const [draftResource, setDraftResource] = useState("");

  const resources = (item.resources || []).map((resource) => {
    let label = resource;
    try {
      label = new URL(resource).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw string */
    }
    return { url: resource, label };
  });

  const handleSaveNotes = () => {
    if (draftNotes !== item.notes) onUpdate(item.id, { notes: draftNotes });
  };

  const handleAddResource = () => {
    const url = draftResource.trim();
    if (!url) return;
    onUpdate(item.id, { resources: [...(item.resources || []), url] });
    setDraftResource("");
  };

  const handleRemoveResource = (urlToRemove) => {
    onUpdate(item.id, {
      resources: (item.resources || []).filter((r) => r !== urlToRemove),
    });
  };

  return (
    <li
      className={`card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 ${status.tint} backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${status.hoverBorder} ${status.glow}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${status.bar}`} />

      <div className="flex flex-1 flex-col p-6">
        {/* Top row: category + delete */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white/60">
            {item.category || "Uncategorized"}
          </span>
          <button
            onClick={() => onDelete(item.id)}
            title="Delete item"
            className="rounded-lg p-1.5 text-white/30 opacity-0 transition hover:bg-red-400/10 hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-xl font-bold leading-snug text-white">
          {item.title}
        </h2>

        {/* Bottom row: status + date */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onCycleStatus(item.id)}
            title="Click to change status"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition hover:brightness-125 ${status.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {item.status}
          </button>

          {item.startedDate && (
            <span className="inline-flex items-center gap-1.5 text-sm text-white/45">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              {item.startedDate}
            </span>
          )}
        </div>

        {/* Resources */}
        {resources.length > 0 && (
          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
            {resources.map((resource, i) => (
              <div key={i} className="flex items-center gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/15 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 text-indigo-300"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  <span className="truncate">{resource.label}</span>
                </a>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveResource(resource.url)}
                    className="rounded-lg p-2 text-white/30 hover:bg-red-400/10 hover:text-red-400"
                    title="Remove resource"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes display */}
        {item.notes && !isEditing && (
          <p className="mt-4 whitespace-pre-wrap border-t border-white/10 pt-3 text-sm text-white/60">
            {item.notes}
          </p>
        )}

        {/* Edit toggle */}
        <button
          onClick={() => setIsEditing((v) => !v)}
          className="mt-3 self-start text-xs font-medium text-white/40 transition hover:text-white/70"
        >
          {isEditing ? "Close" : "+ Add notes / resource"}
        </button>

        {/* Edit panel */}
        {isEditing && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add notes..."
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-indigo-400/60"
            />
            <div className="flex gap-2">
              <input
                value={draftResource}
                onChange={(e) => setDraftResource(e.target.value)}
                placeholder="https://... add a resource link"
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-indigo-400/60"
              />
              <button
                type="button"
                onClick={handleAddResource}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
