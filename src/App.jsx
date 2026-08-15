import { useState, useEffect, useRef } from "react";

// Components
import ShowCard from "./components/ShowCard/ShowCard";
import Navigation from "./components/Navigation/Navigation";
import ShowDetailsModal from "./components/ShowDetailsModal/ShowDetailsModal";
import ShowCardInfoModal from "./components/ShowCardInfoModal/ShowCardInfoModal";

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

function App() {
  const [shows, setShows] = useState([]);
  const [activeFilter, setActiveFilter] = useState("CURRENTLY WATCHING");
  const [navSearch, setNavSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const tmdbAvailable = Boolean(import.meta.env.VITE_TMDB_API_KEY);
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

  const handleProgressChange = (showId, change) => {
    setShows((prev) =>
      prev.map((show) => {
        if (show.id !== showId) {
          return show;
        }

        const newProgress = Math.max(
          0,
          Math.min(
            show.totalEpisodes,
            show.episodesWatched + change
          )
        );

        return {
          ...show,
          episodesWatched: newProgress,
        };
      })
    );
  };

  const handleUpdateShow = (updatedShow) => {
    setShows((prev) =>
      prev.map((show) => (show.id === updatedShow.id ? { ...show, ...updatedShow } : show))
    );
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
            <ShowCard
              key={show.id}
              show={show}
              onProgressChange={handleProgressChange}
              onClick={() => setSelectedShow(show)}
            />
          ))}
        </div>
      </main>

      <ShowDetailsModal
        item={selectedTMDB}
        isOpen={!!selectedTMDB}
        onClose={() => setSelectedTMDB(null)}
        onAdd={handleAddFromTMDB}
      />

      {selectedShow && (
        <ShowCardInfoModal
          key={selectedShow.id}
          show={selectedShow}
          onClose={() => setSelectedShow(null)}
          onSave={(updatedShow) => {
            handleUpdateShow(updatedShow);
            setSelectedShow(null);
          }}
        />
      )}
    </div>
  );
}

export default App;