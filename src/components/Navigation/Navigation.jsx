import PropTypes from "prop-types";
import "./Navigation.scss";
import Profile from "../Profile/Profile";

function Navigation({
  navItems,
  activeFilter,
  onFilterChange,
  user,
  onLogout,
}) {

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="logo">
          MyMovie<span>List</span>
        </div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.value}
              className={item.value === activeFilter ? "active" : ""}
              onClick={() => onFilterChange(item.value)}
            >
              {item.value}
            </button>
          ))}
        </nav>

        {user && (
          <Profile user={user} onLogout={onLogout} />
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
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

export default Navigation;
