import PropTypes from "prop-types";
import "./Navigation.scss";

function Navigation({ navItems, activeFilter, onFilterChange, searchQuery, onSearchChange, searchResults = [], onSelectResult }) {
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

          {searchResults && searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((r) => (
                <li
                  key={r.id}
                  tabIndex={0}
                  onMouseDown={() => onSelectResult && onSelectResult(r)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelectResult && onSelectResult(r);
                  }}
                >
                  <div className="result-title">{r.title}</div>
                  <div className="result-meta">{r.media_type.toUpperCase()} • {r.date}</div>
                </li>
              ))}
            </ul>
          )}
          {!searchResults?.length && searchQuery?.trim() && (
            <div className="search-empty">
              {!import.meta.env.VITE_TMDB_API_KEY ? (
                <div className="no-key">TMDB API key not configured. Create a .env with <strong>VITE_TMDB_API_KEY</strong>.</div>
              ) : (
                <div className="no-results">No results found.</div>
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
  onSelectResult: PropTypes.func,
};

export default Navigation;
