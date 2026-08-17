import { useState, useEffect, useRef } from "react";

// Components
import ShowCard from "./components/ShowCard/ShowCard";
import Navigation from "./components/Navigation/Navigation";
import ShowDetailsModal from "./components/ShowDetailsModal/ShowDetailsModal";
import ShowCardInfoModal from "./components/ShowCardInfoModal/ShowCardInfoModal";
import AuthPanel from "./components/AuthPanel/AuthPanel";

// API calls
import { searchTMDB, getTMDBDetails, buildTmdbPosterPath } from "./api/tmdb";
import { fetchShowsFromSupabase, isSupabaseConfigured, supabase, syncShowsToSupabase } from "./lib/supabase";

const navItems = [
  { value: "ALL", label: "All Shows" },
  { value: "CURRENTLY WATCHING", label: "Currently Watching" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
  { value: "PLAN TO WATCH", label: "Plan to Watch" },
];

const STORAGE_KEY = "my-movie-list-shows";

const getInitialShows = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedShows = window.localStorage.getItem(STORAGE_KEY);
    if (!savedShows) {
      return [];
    }

    const parsedShows = JSON.parse(savedShows);
    return Array.isArray(parsedShows) ? parsedShows : [];
  } catch (error) {
    console.error("Failed to load saved shows", error);
    return [];
  }
};

function App() {
  const [shows, setShows] = useState(getInitialShows);
  const [cards, setCards] = useState([]);
  const [activeFilter, setActiveFilter] = useState("CURRENTLY WATCHING");
  const [sortBy, setSortBy] = useState("name");
  const [navSearch, setNavSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [session, setSession] = useState(null);
  const [authRequired, setAuthRequired] = useState(Boolean(supabase));
  const [authMessage, setAuthMessage] = useState("");
  const tmdbAvailable = Boolean(import.meta.env.VITE_TMDB_API_KEY);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (!supabase) {
      setAuthRequired(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthRequired(!data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthRequired(!nextSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadShows = async () => {
      if (!isSupabaseConfigured || !session) {
        // Clear shows when no session
        setShows([]);
        return;
      }

      const supabaseShows = await fetchShowsFromSupabase();
      setShows(supabaseShows);
    };

    loadShows();
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shows));
    }

    if (isSupabaseConfigured && session) {
      syncShowsToSupabase(shows);
    }
  }, [shows, session]);

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

  const prepareShowName = (showName, seasonName, totalSeasons) => {
    if (totalSeasons === 1) {
      return showName;
    }

    return seasonName.startsWith(showName) ? seasonName : `${showName}: ${seasonName}`
  }

  useEffect(() => {
    const newCards = shows.flatMap(show =>
      show.seasons.map(season => ({
        ...season,
        type: show.type,
        status: show.status,
        showStatus: show.showStatus,
        name: prepareShowName(show.title, season.name, show.seasons.length),
        rating: show.rating,
        episodesWatched: season.episodesWatched ?? 0,
        overview: season.overview || show.overview,
        genres: show.genres
      }))
    );

    setCards(newCards);
  }, [shows]);

  const filteredShows = cards
    .filter((card) => {
      const matchesStatus = activeFilter === "ALL" ? true : card.status === activeFilter;
      return matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "score") {
        return b.rating - a.rating;
      }
      return 0;
    });

  // console.log("Shows: ", shows);
  // console.log("Cards: ", cards);
  console.log(filteredShows)
  console.log(selectedShow)

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

  const handleProgressChange = (seasonId, change) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id !== seasonId) return card;

        const newProgress = Math.max(
          0,
          Math.min(
            card.episode_count,
            (card.episodesWatched ?? 0) + change
          )
        );

        return {
          ...card,
          episodesWatched: newProgress
        };
      })
    );

    setShows(prev =>
      prev.map(show => ({
        ...show,
        seasons: show.seasons.map(season => {
          if (season.id !== seasonId) return season;

          const newProgress = Math.max(
            0,
            Math.min(
              season.episode_count,
              (season.episodesWatched ?? 0) + change
            )
          );

          return {
            ...season,
            episodesWatched: newProgress
          };
        })
      }))
    );
  };

  const handleUpdateShow = (updatedShow) => {
    setShows((prev) =>
      prev.map((show) => (show.id === updatedShow.id ? { ...show, ...updatedShow } : show))
    );
  };

  const handleAuth = async ({ email, password, action }) => {
    if (!supabase) {
      return { error: { message: "Supabase is not configured yet." } };
    }

    setAuthMessage("");

    if (action === "signUp") {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (!response.error && response.data?.user && !response.data.user.email_confirmed_at) {
        setAuthMessage("Check your email to verify your account before signing in.");
      }

      return response;
    }

    const response = await supabase.auth.signInWithPassword({ email, password });

    if (!response.error && response.data?.user && !response.data.user.email_confirmed_at) {
      setAuthMessage("Please verify your email before continuing.");
    }

    return response;
  };

  const handleLogout = async () => {
    if (!supabase) {
      setAuthRequired(false);
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setAuthRequired(true);
    setAuthMessage("");
  };

  if (authRequired) {
    return (
      <AuthPanel
        onAuthSuccess={handleAuth}
        onCancel={() => setAuthRequired(false)}
        statusMessage={authMessage}
      />
    );
  }

  return (
    <div className="app">
      <Navigation
        navItems={navItems}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        user={session?.user || null}
        onLogout={handleLogout}
      />

      <main className="content">
        <div className="toolbar">
          <div className="toolbar-title">{activeTitle}</div>

          <div className="toolbar-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort shows by"
            >
              <option value="name">Sort: Name</option>
              <option value="score">Sort: Score</option>
            </select>
          </div>

          <div className="toolbar-search" role="search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="text"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Search TMDB..."
              aria-label="Search shows"
              autoComplete="off"
            />

            {searchResults?.length > 0 && (
              <ul className="search-results">
                {searchResults.map((result) => (
                  <li key={result.id} className="search-result-item">
                    <button
                      type="button"
                      className="search-result-button"
                      onClick={() => handleSelectResult(result)}
                    >
                      <img
                        src={buildTmdbPosterPath(result.poster_path)}
                        alt={result.title}
                        className="result-poster"
                      />
                      <div className="result-copy">
                        <div className="result-title-row">
                          <span className="result-title">{result.title}</span>
                          <span className="result-rating">
                            {result.vote_average > 0 ? `★ ${result.vote_average.toFixed(1)}` : "N/A"}
                          </span>
                        </div>

                        <div className="result-meta-row">
                          <span className="result-type">
                            {result.media_type?.toUpperCase() || "TV"}
                          </span>
                          <span className="result-date">
                            {result.date ? new Date(result.date).getFullYear() : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {navSearch?.trim() && !isSearching && searchResults.length === 0 && (
              <div className="search-empty">
                {tmdbAvailable ? (
                  <div className="no-results">No results found.</div>
                ) : (
                  <div className="no-key">TMDB API key not configured.</div>
                )}
              </div>
            )}
          </div>
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
        existingShows={shows}
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