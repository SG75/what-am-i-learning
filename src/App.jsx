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
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20";

const iconBtnCls =
  "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-base font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white";

function App() {
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
      notes: "",
      resources: [],
    };

    setItems([...items, itemToAdd]);
    setNewItem({ title: "", category: "", status: "learning" });
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
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                What am I <span className="gradient-text">learning</span>?
              </h1>
              <p className="mt-1.5 text-base text-white/45">
                Track courses, resources and progress — all in one place.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
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
          </div>
        </header>

        {/* Add-item form */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1.4fr_1fr_0.9fr_auto]"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-white/40"
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
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-white/40"
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
                className="mb-2 block text-sm font-semibold uppercase tracking-wider text-white/40"
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
                    : "border border-white/10 bg-white/5 text-white/55 hover:border-white/25 hover:text-white"
                }`}
              >
                {filter}
                <span
                  className={`rounded-full px-2 text-sm font-semibold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-white/45"
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
          onCycleStatus={handleCycleStatus}
          activeFilter={activeFilter}
        />

        <footer className="mt-12 border-t border-white/5 pt-6 text-center text-sm text-white/30">
          Your list is saved locally in this browser.
        </footer>
      </div>
    </div>
  );
}

export default App;
