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
  user,
  onLogout,
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

        {user && (
          <div className="user-profile">
            <div className="user-avatar" aria-hidden="true">
              {user.email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-meta">
              <span className="user-label">Signed in</span>
              <span className="user-email">{user.email}</span>
            </div>

            <button type="button" className="logout-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        )}
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
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

export default Navigation;
