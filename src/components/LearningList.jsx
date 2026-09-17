import LearningCard from "./LearningCard";

export default function LearningList({ items, onDelete }) {
  if (items.length === 0) {
    return <p>No items match this filter.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <li key={item.id}>
          <LearningCard item={item} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
