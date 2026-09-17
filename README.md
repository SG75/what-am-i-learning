# What Am I Learning

A lightweight React + Tailwind CSS app for tracking what you're currently learning — courses, resources, and progress status — all in one place. Data is stored in your browser (`localStorage`), and you can export/import your list as JSON for backup or transfer between devices.

Built as a hands-on React learning project, and shared here as a starting template you can fork and adapt for your own tracking needs (books read, side projects, job applications, habits — anything list-shaped with a status).

## Features

- **Add items** — title, category, and status via a simple form
- **Status tracking** — `learning`, `yet to start`, `done`, with color-coded badges
- **Filter bar** — view all items or filter by status
- **Delete items** — remove entries you no longer need
- **Resource links** — attach one or more URLs per item (course dashboards, docs, etc.)
- **Persistent storage** — your list survives page refreshes via `localStorage`
- **Import/Export JSON** — back up your data or move it between browsers/devices
- **Responsive grid layout** — 1/2/3 columns depending on screen size
- **Dark theme** styled with Tailwind CSS

## Tech Stack

- [React](https://react.dev/) (Vite)
- [Tailwind CSS](https://tailwindcss.com/) v4

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Project Structure

```
src/
  components/
    LearningCard.jsx   # Single item card — title, badge, links, delete button
    LearningList.jsx   # Grid of cards, handles empty state
  data/
    learningItems.js   # Seed/default data (used on first load only)
  App.jsx               # Top-level state, form, filters, import/export
```

## Data Shape

Each learning item follows this shape:

```javascript
{
  id: 1,
  title: "Full Stack Open",
  category: "Full Stack",
  status: "learning",       // "learning" | "yet to start" | "done"
  startedDate: "20-Aug-2026",
  notes: "",
  resources: ["https://fullstackopen.com/en/#course-contents"]
}
```

## Using This as a Template

This project is intentionally small and easy to fork for a different use case. A few starting points if you want to adapt it:

- **Change the domain** — swap "learning items" for books, applications, habits, or any other trackable list. Update the field names in `data/learningItems.js` and the form in `App.jsx` to match.
- **Add/remove statuses** — edit the `filters` array and `statusStyles` object (in `LearningCard.jsx`) together, since they need to stay in sync.
- **Add more fields** — extend the item shape (e.g. a `priority` or `deadline` field) and add matching inputs to the add-item form.
- **Swap storage** — replace the `localStorage` calls in `App.jsx` with a backend API or a service like Firebase if you want multi-device sync without manual JSON export/import.
- **Add editing** — currently items can be added and deleted; editing in place is a natural next feature, following the same "lift state up, pass callbacks down" pattern used for delete.

## License

Free to use, modify, and share as a starting point for your own projects.
