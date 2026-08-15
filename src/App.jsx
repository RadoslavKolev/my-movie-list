import { useState } from "react";

// Components
import ShowCard from "./components/ShowCard/ShowCard";
import Navigation from "./components/Navigation/Navigation";

const navItems = [
  { value: "ALL", label: "All Shows" },
  { value: "CURRENTLY WATCHING", label: "Currently Watching" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
  { value: "PLAN TO WATCH", label: "Plan to Watch" },
];

// Dummy data for testing
const shows = [
  {
    id: 1,
    title: "Breaking Bad",
    poster:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    rating: 9,
    episodesWatched: 32,
    totalEpisodes: 62,
    type: "TV",
    status: "CURRENTLY WATCHING",
  },

  {
    id: 2,
    title: "Better Call Saul",
    poster:
      "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg",
    rating: 9,
    episodesWatched: 20,
    totalEpisodes: 63,
    type: "TV",
    status: "CURRENTLY WATCHING",
  },

  {
    id: 3,
    title: "The Last of Us",
    poster:
      "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    rating: 8,
    episodesWatched: 5,
    totalEpisodes: 9,
    type: "TV",
    status: "PLAN TO WATCH",
  },

  {
    id: 4,
    title: "Stranger Things",
    poster:
      "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    rating: 9,
    episodesWatched: 12,
    totalEpisodes: 34,
    type: "TV",
    status: "ON HOLD",
  },

  {
    id: 5,
    title: "Game of Thrones",
    poster:
      "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    rating: 0,
    episodesWatched: 73,
    totalEpisodes: 73,
    type: "TV",
    status: "COMPLETED",
  },
];

function App() {
  const [activeFilter, setActiveFilter] = useState("CURRENTLY WATCHING");

  const filteredShows =
    activeFilter === "ALL"
      ? shows
      : shows.filter((show) => show.status === activeFilter);

  const activeTitle =
    navItems.find((item) => item.value === activeFilter)?.label || "Currently Watching";

  return (
    <div className="app">
      <Navigation
        navItems={navItems}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main className="content">
        <h1>{activeTitle}</h1>
        <div className="shows-grid">
          {filteredShows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;