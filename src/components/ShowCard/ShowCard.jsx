import PropTypes from 'prop-types';
import "./ShowCard.scss";

function ShowCard({ show, onProgressChange }) {
  const { poster, title, rating = 0, episodesWatched, totalEpisodes, type } = show;

  return (
    <div className="show-card">
      <div className="poster-container">
        <img
          src={poster}
          alt={title}
          className="poster"
        />
        <div className="rating">
          {rating > 0 ? rating : "N/A"}
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
                disabled={show.episodesWatched <= 0}
                onClick={(event) => {
                  event.stopPropagation();
                  onProgressChange(show.id, -1);
                }}
              >
                −
              </button>

              <div className="progress-count">
                {show.episodesWatched} / {show.totalEpisodes}
              </div>

              <button
                type="button"
                className="progress-button"
                disabled={show.episodesWatched >= show.totalEpisodes}
                onClick={(event) => {
                  event.stopPropagation();
                  onProgressChange(show.id, 1);
                }}
              >
                +
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${show.totalEpisodes > 0
                    ? (show.episodesWatched / show.totalEpisodes) * 100
                    : 0
                    }%`,
                }}
              />
            </div>
            <div className="type">
              {show.type}
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
  }).isRequired,
};

export default ShowCard;