import { useState, useEffect, useRef } from "react";

// Components
import ShowCard from "./components/ShowCard/ShowCard";
import Navigation from "./components/Navigation/Navigation";
import ShowDetailsModal from "./components/ShowDetailsModal/ShowDetailsModal";

// API calls
import { searchTMDB, getTMDBDetails } from "./api/tmdb";

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
  const [navSearch, setNavSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const tmdbAvailable = Boolean(import.meta.env.VITE_TMDB_API_KEY);
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!navSearch?.trim()) {
      setTimeout(() => {
        setIsSearching(false);
        setSearchResults([]);
      }, 0);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchTMDB(navSearch);
      setSearchResults(res);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(searchTimer.current);
  }, [navSearch]);

  const filteredShows = shows.filter((show) => {
    const matchesStatus = activeFilter === "ALL" ? true : show.status === activeFilter;
    return matchesStatus;
  });

  const activeTitle =
    navItems.find((item) => item.value === activeFilter)?.label || "Currently Watching";

  const handleSelectResult = async (item) => {
    const enriched = await getTMDBDetails(item.media_type, item.tmdbId);
    const finalItem = enriched || item;

    setSelectedTMDB(finalItem);
    setSearchResults([]);
    setNavSearch("");
  };

  const handleAddFromTMDB = (newShow) => {
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
        isSearching={isSearching}
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