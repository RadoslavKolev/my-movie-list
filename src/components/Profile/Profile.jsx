import PropTypes from "prop-types";
import "./Profile.scss";

function Profile({ user, onLogout }) {
  return (
    <div className="profile-panel">
      <div className="profile-avatar" aria-hidden="true">
        {user.email?.charAt(0)?.toUpperCase() || "U"}
      </div>

      <div className="profile-meta">
        <span className="profile-label">Signed in</span>
        <span className="profile-email">{user.email}</span>
      </div>

      <button
        type="button"
        className="logout-icon-button"
        onClick={onLogout}
        title="Log out"
        aria-label="Log out"
      >
        ↪
      </button>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Profile;
