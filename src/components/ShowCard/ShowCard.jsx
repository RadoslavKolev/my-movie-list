import PropTypes from 'prop-types';
import "./ShowCard.scss";

function ShowCard({ show, onProgressChange, onClick }) {
  const { id, poster, title, rating = 0, episodesWatched, totalEpisodes, type, status } = show;

  const getProgressBarColor = (currentStatus) => {
    switch (currentStatus) {
      case "COMPLETED":
        return "#3fcf7f";
      case "ON HOLD":
        return "#c79a00";
      case "DROPPED":
        return "#d63a3a";
      default:
        return "#18e5e7";
    }
  };

  const progressBarColor = getProgressBarColor(status);

  return (
    <div className="show-card" onClick={onClick}>
      <div className="poster-container">
        <img
          src={poster}
          alt={title}
          className="poster"
        />
        <div className="rating">
          {rating > 0 ? `★ ${rating}` : "N/A"}
        </div>
        <div className="hover-overlay">
          <div className="hover-info">
            <div className="progress-label">
              Progress
            </div>
            <div className="progress-controls">
              <button
                type="button"
                className="progress-button"
                disabled={episodesWatched <= 0}
                onClick={(event) => {
                  event.stopPropagation();
                  onProgressChange(id, -1);
                }}
              >
                −
              </button>

              <div className="progress-count">
                {episodesWatched} / {totalEpisodes}
              </div>

              <button
                type="button"
                className="progress-button"
                disabled={episodesWatched >= totalEpisodes}
                onClick={(event) => {
                  event.stopPropagation();
                  onProgressChange(id, 1);
                }}
              >
                +
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${totalEpisodes > 0
                    ? (episodesWatched / totalEpisodes) * 100
                    : 0
                    }%`,
                  background: progressBarColor,
                }}
              />
            </div>
            <div className="type">
              {type}
            </div>
          </div>
        </div>
      </div>
      <div className="show-title">
        {title}
      </div>
    </div>
  );
}

ShowCard.propTypes = {
  show: PropTypes.shape({
    poster: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number,
    episodesWatched: PropTypes.number.isRequired,
    totalEpisodes: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
  onProgressChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ShowCard;