// import PropTypes from 'prop-types';

function ShowCard({ show }) {
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
            <div className="progress">
              {episodesWatched} / {totalEpisodes}
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

// ShowCard.propTypes = {
//   show: PropTypes.shape({
//     poster: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     rating: PropTypes.number,
//     episodesWatched: PropTypes.number.isRequired,
//     totalEpisodes: PropTypes.number.isRequired,
//     type: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default ShowCard;