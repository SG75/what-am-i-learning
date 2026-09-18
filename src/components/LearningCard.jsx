import { useState } from "react";

const statusConfig = {
  learning: {
    bar: "from-emerald-400 via-teal-400 to-cyan-400",
    tint: "bg-learning/[0.08]",
    hoverBorder: "hover:border-learning/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgb(var(--learning)/0.35)]",
    badge: "border-learning/30 bg-learning/15 text-learning",
    dot: "bg-learning",
  },
  "yet to start": {
    bar: "from-amber-400 via-orange-400 to-rose-400",
    tint: "bg-queued/[0.08]",
    hoverBorder: "hover:border-queued/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgb(var(--queued)/0.35)]",
    badge: "border-queued/30 bg-queued/15 text-queued",
    dot: "bg-queued",
  },
  done: {
    bar: "from-sky-400 via-blue-400 to-indigo-400",
    tint: "bg-finished/[0.08]",
    hoverBorder: "hover:border-finished/50",
    glow: "hover:shadow-[0_24px_50px_-15px_rgb(var(--finished)/0.35)]",
    badge: "border-finished/30 bg-finished/15 text-finished",
    dot: "bg-finished",
  },
};

const fallback = statusConfig["yet to start"];

const editInputCls =
  "w-full rounded-lg border border-surface/15 bg-surface/5 px-3 py-2 text-sm text-surface placeholder:text-surface/30 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

const parseResources = (text) =>
  text
    .split(/[,,\n]/)
    .map((r) => r.trim())
    .filter(Boolean);

export default function LearningCard({
  item,
  onDelete,
  onUpdate,
  onCycleStatus,
  index = 0,
}) {
  const status = statusConfig[item.status] || fallback;

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    category: "",
    status: "learning",
    notes: "",
    resourcesText: "",
  });

  const startEdit = () => {
    setDraft({
      title: item.title,
      category: item.category || "",
      status: item.status,
      notes: item.notes || "",
      resourcesText: (item.resources || []).join(", "),
    });
    setIsEditing(true);
  };

  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onUpdate(item.id, {
      title: draft.title.trim(),
      category: draft.category.trim(),
      status: draft.status,
      notes: draft.notes.trim(),
      resources: parseResources(draft.resourcesText),
    });
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const resources = (item.resources || []).map((resource) => {
    let label = resource;
    try {
      label = new URL(resource).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw string */
    }
    return { url: resource, label };
  });

  return (
    <li
      className={`card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-surface/10 ${status.tint} backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${status.hoverBorder} ${status.glow}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${status.bar}`} />

      {isEditing ? (
        /* ---------- EDIT MODE ---------- */
        <form
          onSubmit={handleSave}
          className="flex flex-1 flex-col gap-3 p-6"
        >
          <input
            name="title"
            value={draft.title}
            onChange={handleDraftChange}
            placeholder="Title"
            autoFocus
            className={`${editInputCls} text-base font-semibold`}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="category"
              value={draft.category}
              onChange={handleDraftChange}
              placeholder="Category"
              className={editInputCls}
            />
            <select
              name="status"
              value={draft.status}
              onChange={handleDraftChange}
              className={editInputCls}
            >
              <option value="learning">Learning</option>
              <option value="yet to start">Yet to start</option>
              <option value="done">Done</option>
            </select>
          </div>

          <input
            name="notes"
            value={draft.notes}
            onChange={handleDraftChange}
            placeholder="Notes (optional)"
            className={editInputCls}
          />

          <input
            name="resourcesText"
            value={draft.resourcesText}
            onChange={handleDraftChange}
            placeholder="Resources (comma-separated URLs)"
            className={editInputCls}
          />

          <div className="mt-1 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-indigo-400 hover:to-violet-400 active:scale-[0.98]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-surface/15 bg-surface/5 px-4 py-2 text-sm font-medium text-surface/60 transition hover:border-surface/25 hover:text-surface"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* ---------- VIEW MODE ---------- */
        <div className="flex flex-1 flex-col p-6">
          {/* Top row: category + actions */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="rounded-lg bg-surface/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-surface/60">
              {item.category || "Uncategorized"}
            </span>
            <div className="flex gap-1 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
              <button
                onClick={startEdit}
                title="Edit item"
                className="rounded-lg p-1.5 text-surface/30 transition hover:bg-accent/10 hover:text-accent"
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
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                title="Delete item"
                className="rounded-lg p-1.5 text-surface/30 transition hover:bg-red-400/10 hover:text-red-400"
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
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-bold leading-snug">{item.title}</h2>

          {/* Notes */}
          {item.notes && (
            <p className="mb-4 line-clamp-3 text-base leading-relaxed text-surface/60">
              {item.notes}
            </p>
          )}

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
              <span className="inline-flex items-center gap-1.5 text-sm text-surface/45">
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
            <div className="mt-5 flex flex-col gap-2 border-t border-surface/10 pt-4">
              {resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-surface/10 px-3.5 py-2.5 text-sm font-medium text-surface/70 transition hover:bg-surface/15 hover:text-surface"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 text-accent"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  <span className="truncate">{resource.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
