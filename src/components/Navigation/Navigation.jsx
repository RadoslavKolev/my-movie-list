import PropTypes from "prop-types";
import "./Navigation.scss";

function Navigation({ navItems, activeFilter, onFilterChange }) {
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
};

export default Navigation;
