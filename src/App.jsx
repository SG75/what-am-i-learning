import "./App.css";
import LearningList from "./components/LearningList";
import learningItems from "./data/learningItems";
import { useState, useEffect } from "react";

const filters = ["all", "learning", "yet to start", "done"];

const btnBase = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors";
const btnPrimary = `${btnBase} bg-white text-black hover:bg-neutral-200`;
const btnSecondary = `${btnBase} bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700`;

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

    const itemsToAdd = {
      id: nextId,
      title: newItem.title,
      category: newItem.category,
      status: newItem.status,
      startDate: new Date().toLocaleDateString(),
      notes: "",
      resources: [],
    };

    setItems([...items, itemsToAdd]);
    setNewItem({ title: "", category: "", status: "learning" });
  };

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.status === activeFilter);

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
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">What Am I Learning</h1>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-4 flex-wrap bg=neutral-900 rounded-xl border border-neutral-800 mb-4"
          >
            <input
              name="title"
              value={newItem.title}
              onChange={handleChange}
              placeholder="Title"
              className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
            <input
              name="category"
              value={newItem.category}
              onChange={handleChange}
              placeholder="Category"
              className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
            <select
              name="status"
              value={newItem.status}
              onChange={handleChange}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
            >
              <option value="learning">learning</option>
              <option value="yet to start">yet to start</option>
              <option value="done">done</option>
            </select>
            <button type="submit" className={btnPrimary}>
              Add
            </button>
          </form>
          <div className="flex gap-2 p-4">
            <button onClick={handleExport} className={btnSecondary}>
              Export JSON
            </button>

            <label className={`${btnSecondary} cursor-pointer`}>
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex gap-2 p-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${activeFilter === filter ? "bg-white text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <LearningList items={filteredItems} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}

export default App;
