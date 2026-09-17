const statusStyles = {
  learning: "bg-green-900 text-green-300",
  "yet to start": "bg-gray-700 text-gray-300",
  done: "bg-blue-900 text-blue-300",
};

export default function LearningCard({ item, onDelete }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-sm hover:border-neutral-600 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-semibold">{item.title}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs ${statusStyles[item.status] || "bg-neutral-700 text-neutral-300"}`}
        >
          {item.status}
        </span>
        <button
          onClick={() => onDelete(item.id)}
          className="mt-2 px-3 py-1 rounded bg-red-900 text-red-300 text-xs hover:bg-red-800"
        >
          Delete
        </button>
      </div>

      {item.resources.length > 0 && (
        <div className="flex flex-col gap-1 pt-2 border-t border-neutral-800">
          {item.resources.map((resource, index) => (
            <a
              key={index}
              href={resource}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all truncate text-sm text-blue-400 hover:underline"
            >
              {" "}
              {resource}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
