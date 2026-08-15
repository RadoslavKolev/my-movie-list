import PropTypes from "prop-types";
import "./Navigation.scss";
import { buildTmdbPosterPath } from "../../api/tmdb";

function Navigation({
  navItems,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchResults = [],
  isSearching = false,
  onSelectResult,
}) {
  const hasTmdbKey = Boolean(import.meta.env.VITE_TMDB_API_KEY);
  const shouldShowNoResults =
    searchQuery?.trim() && !isSearching && searchResults.length === 0;

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="logo">
          MyMovie<span>List</span>
        </div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.value}
              className={item.value === activeFilter ? "active" : ""}
              onClick={() => onFilterChange(item.value)}
            >
              {item.value}
            </button>
          ))}
        </nav>

        <div className="navbar-search" role="search">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search TMDB..."
            aria-label="Search shows"
            autoComplete="off"
          />

          {searchResults?.length > 0 && (
            <ul className="search-results">
              {searchResults.map((r) => (
                <li key={r.id} className="search-result-item">
                  <button
                    type="button"
                    className="search-result-button"
                    onClick={() => onSelectResult?.(r)}
                  >
                    <img
                      src={buildTmdbPosterPath(r.poster_path)}
                      alt={r.title}
                      className="result-poster"
                    />
                    <div className="result-copy">
                      <div className="result-title-row">
                        <span className="result-title">{r.title}</span>
                        <span className="result-rating">
                          {r.vote_average > 0 ? `★ ${r.vote_average.toFixed(1)}` : "N/A"}
                        </span>
                      </div>

                      <div className="result-meta-row">
                        <span className="result-type">
                          {r.media_type?.toUpperCase() || "TV"}
                        </span>
                        <span className="result-date">
                          {r.date ? new Date(r.date).getFullYear() : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {shouldShowNoResults && (
            <div className="search-empty">
              {hasTmdbKey ? (
                <div className="no-results">No results found.</div>
              ) : (
                <div className="no-key">TMDB API key not configured.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Navigation.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchResults: PropTypes.array,
  isSearching: PropTypes.bool,
  onSelectResult: PropTypes.func,
};

export default Navigation;
