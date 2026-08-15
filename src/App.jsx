import { useState, useEffect, useRef } from "react";

// Components
import ShowCard from "./components/ShowCard/ShowCard";
import Navigation from "./components/Navigation/Navigation";
import AddShowModal from "./components/AddShowModal/AddShowModal";
import ShowDetailsModal from "./components/ShowDetailsModal/ShowDetailsModal";
import { searchTMDB } from "./api/tmdb";

const navItems = [
  { value: "ALL", label: "All Shows" },
  { value: "CURRENTLY WATCHING", label: "Currently Watching" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
  { value: "PLAN TO WATCH", label: "Plan to Watch" },
];

// Dummy data for testing
const initialShows = [
  {
    id: 1,
    title: "Spirited Away",
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
  const [shows, setShows] = useState(initialShows);
  const [activeFilter, setActiveFilter] = useState("CURRENTLY WATCHING");
  // `navSearch` is for TMDB queries from the top nav. The main list search
  // will be a separate feature later and should not be tied to this.
  const [navSearch, setNavSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const tmdbAvailable = Boolean(import.meta.env.VITE_TMDB_API_KEY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    // debounce nav search (TMDB)
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!navSearch || !navSearch.trim()) {
      // clear results asynchronously to avoid synchronous setState in effect
      setTimeout(() => setSearchResults([]), 0);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      const res = await searchTMDB(navSearch);
      setSearchResults(res);
    }, 350);

    return () => clearTimeout(searchTimer.current);
  }, [navSearch]);

  // For now the grid filters only by status. Main-search (local) will be
  // implemented separately — the navbar search hits TMDB instead.
  const filteredShows = shows.filter((show) => {
    const matchesStatus = activeFilter === "ALL" ? true : show.status === activeFilter;
    return matchesStatus;
  });

  const activeTitle =
    navItems.find((item) => item.value === activeFilter)?.label || "Currently Watching";

  const handleAddShow = (newShow) => {
    setShows((prevShows) => [newShow, ...prevShows]);
    setActiveFilter(newShow.status);
  };

  const handleSelectResult = (item) => {
    setSelectedTMDB(item);
    setSearchResults([]);
    setNavSearch("");
  };

  const handleAddFromTMDB = (newShow) => {
    // when adding from TMDB, preserve as added show
    setShows((prev) => [newShow, ...prev]);
    setActiveFilter(newShow.status);
  };

  return (
    <div className="app">
      <Navigation
        navItems={navItems}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={navSearch}
        onSearchChange={setNavSearch}
        searchResults={searchResults}
        onSelectResult={handleSelectResult}
        tmdbAvailable={tmdbAvailable}
      />

      <main className="content">
        <div className="toolbar">
          <h1>{activeTitle}</h1>
        </div>


        <div className="shows-grid">
          {filteredShows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      </main>

      <button className="add-show-button" onClick={() => setIsModalOpen(true)}>
        + Add Show
      </button>

      <AddShowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddShow}
        statusOptions={navItems.filter((item) => item.value !== "ALL")}
      />

      <ShowDetailsModal
        item={selectedTMDB}
        isOpen={!!selectedTMDB}
        onClose={() => setSelectedTMDB(null)}
        onAdd={handleAddFromTMDB}
      />
    </div>
  );
}

export default App;