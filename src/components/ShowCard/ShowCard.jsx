import PropTypes from 'prop-types';
import "./ShowCard.scss";

function ShowCard({ show, onProgressChange, onClick }) {
  const {
    id,
    poster,
    title,
    rating = 0,
    episodesWatched,
    totalEpisodes,
    type,
    status,
    year,
    season,
  } = show;

  console.log(show);

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
  const progressPercent = totalEpisodes > 0 ? (episodesWatched / totalEpisodes) * 100 : 0;

  const handleDecrement = (event) => {
    event.stopPropagation();
    onProgressChange(id, -1);
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    onProgressChange(id, 1);
  };

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
                onClick={handleDecrement}
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
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercent}%`,
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

      <div className="card-body">
        <div className="card-title-row">
          <div className="show-title">
            {title}
          </div>
          <div className="mobile-rating">
            {rating > 0 ? `★ ${rating}` : "N/A"}
          </div>
        </div>

        <div className="card-meta">
          <span className="meta-text">{type} · {year} {season}</span>
        </div>

        <div className="mobile-progress">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                background: progressBarColor,
              }}
            />
          </div>

          <div className="mobile-progress-row">
            <div className="progress-count">
              {episodesWatched} / {totalEpisodes > 0 ? totalEpisodes : "??"} ep
            </div>

            <div className="progress-controls">
              <button
                type="button"
                className="progress-button"
                disabled={episodesWatched <= 0}
                onClick={handleDecrement}
              >
                −
              </button>

              <button
                type="button"
                className="progress-button"
                disabled={totalEpisodes > 0 && episodesWatched >= totalEpisodes}
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
        </div>
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
    year: PropTypes.number,
    season: PropTypes.string,
  }).isRequired,
  onProgressChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ShowCard;