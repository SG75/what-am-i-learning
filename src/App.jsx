import { useState, useEffect } from "react";
import LearningList from "./components/LearningList";
import learningItems from "./data/learningItems";

const filters = ["all", "learning", "yet to start", "done"];
const statusOrder = ["learning", "yet to start", "done"];

const filterGradients = {
  all: "from-indigo-500 to-violet-500 shadow-indigo-500/25",
  learning: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
  "yet to start": "from-amber-500 to-orange-500 shadow-amber-500/25",
  done: "from-sky-500 to-blue-500 shadow-sky-500/25",
};

const inputCls =
  "w-full rounded-xl border border-surface/10 bg-surface/5 px-4 py-3 text-base text-surface placeholder:text-surface/40 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

const iconBtnCls =
  "inline-flex items-center gap-2 rounded-xl border border-surface/10 bg-surface/5 px-5 py-3 text-base font-medium text-surface/70 transition hover:border-surface/25 hover:bg-surface/10 hover:text-surface";

const SunIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("learningItems");
    return saved ? JSON.parse(saved) : learningItems;
  });

  useEffect(() => {
    localStorage.setItem("learningItems", JSON.stringify(items));
  }, [items]);

  const [newItem, setNewItem] = useState({
    title: "",
    category: "",
    status: "learning",
    notes: "",
    resources: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    const nextId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

    const itemToAdd = {
      id: nextId,
      title: newItem.title.trim(),
      category: newItem.category.trim(),
      status: newItem.status,
      startedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      notes: newItem.notes.trim(),
      resources: newItem.resources
        .split(/[,,\n]/)
        .map((r) => r.trim())
        .filter(Boolean),
    };

    setItems([...items, itemToAdd]);
    setNewItem({
      title: "",
      category: "",
      status: "learning",
      notes: "",
      resources: "",
    });
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCycleStatus = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                statusOrder[
                  (statusOrder.indexOf(item.status) + 1) % statusOrder.length
                ],
            }
          : item,
      ),
    );
  };

  const handleUpdate = (id, updatedFields) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );
  };

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.status === activeFilter);

  const countFor = (filter) =>
    filter === "all"
      ? items.length
      : items.filter((item) => item.status === filter).length;

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "learning-items.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedItems = JSON.parse(event.target.result);
        if (!Array.isArray(importedItems)) {
          alert("Invalid file: expected a JSON array of items");
          return;
        }
        setItems(importedItems);
      } catch (err) {
        alert("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What am I <span className="gradient-text">learning</span>?
              </h1>
              <p className="mt-1.5 text-base text-surface/50">
                Track courses, resources and progress — all in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExport} className={iconBtnCls}>
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Export
            </button>
            <label className={`${iconBtnCls} cursor-pointer`}>
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-surface/10 bg-surface/5 text-surface/70 transition hover:border-surface/25 hover:bg-surface/10 hover:text-surface"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* Add-item form */}
        <section className="mb-8 rounded-2xl border border-surface/10 bg-surface/[0.03] p-6 backdrop-blur">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1.4fr_1fr_0.9fr_auto]"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-surface/50"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                value={newItem.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Open"
                className={inputCls}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-surface/50"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                value={newItem.category}
                onChange={handleChange}
                placeholder="e.g. Full Stack"
                className={inputCls}
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-surface/50"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={newItem.status}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="learning">Learning</option>
                <option value="yet to start">Yet to start</option>
                <option value="done">Done</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400 active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add
            </button>

            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-surface/50"
              >
                Notes{" "}
                <span className="font-normal normal-case tracking-normal text-surface/35">
                  (optional)
                </span>
              </label>
              <input
                id="notes"
                name="notes"
                value={newItem.notes}
                onChange={handleChange}
                placeholder="e.g. Focus on part 2, GraphQL chapter is skippable for now"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="resources"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-surface/50"
              >
                Resources{" "}
                <span className="font-normal normal-case tracking-normal text-surface/35">
                  (comma-separated URLs)
                </span>
              </label>
              <input
                id="resources"
                name="resources"
                value={newItem.resources}
                onChange={handleChange}
                placeholder="https://fullstackopen.com, https://courses.mooc.fi"
                className={inputCls}
              />
            </div>
          </form>
        </section>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${filterGradients[filter]} text-white shadow-lg`
                    : "border border-surface/10 bg-surface/5 text-surface/60 hover:border-surface/25 hover:text-surface"
                }`}
              >
                {filter}
                <span
                  className={`rounded-full px-2 text-sm font-semibold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-surface/10 text-surface/50"
                  }`}
                >
                  {countFor(filter)}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <LearningList
          items={filteredItems}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCycleStatus={handleCycleStatus}
          activeFilter={activeFilter}
        />

        <footer className="mt-12 border-t border-surface/10 pt-6 text-center text-sm text-surface/40">
          Your list is saved locally in this browser.
        </footer>
      </div>
    </div>
  );
}

export default App;
