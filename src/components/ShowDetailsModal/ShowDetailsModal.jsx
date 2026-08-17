import PropTypes from "prop-types";
import { useState } from "react";
import "./ShowDetailsModal.scss";
import { getEpisodeDefaults } from "../../utils/episodes";

function ShowDetailsModal({ item, isOpen, onClose, onAdd, existingShows = [] }) {
  const [status, setStatus] = useState("PLAN TO WATCH");

  if (!isOpen || !item) return null;

  // Check if show already exists
  const isAlreadyAdded = existingShows.some(
    (show) => show.id === `tmdb-${item.tmdbId}`
  );

  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://placehold.co/500x750/1b0034/ffffff?text=No+Image";

  const handleAdd = () => {
    const episodeDefaults = getEpisodeDefaults(item, status);
    const genres = item.genres?.map((genre) => genre.name) || [];

    const newShow = {
      id: `tmdb-${item.tmdbId}`,
      title: item.title,
      poster,
      overview: item.overview,
      showStatus: item.status,
      genres,
      seasons: item.seasons,
      rating: 0,
      overallRating: item.vote_average,
      episodesWatched: episodeDefaults.episodesWatched,
      totalEpisodes: episodeDefaults.totalEpisodes,
      type: item.media_type === "movie" ? "Movie" : "TV",
      status,
      airingPeriod: item.date,
    };
    onAdd(newShow);
    onClose();
  };

  const formatMediaTypeAndGenre = (item) => {
    const mediaType = item.media_type?.toUpperCase() || "";
    const genres = item.genres?.map(genre => genre.name).join(", ") || "";

    return `${mediaType} - ${genres}`;
  };

  const formatDateSeasonsAndStatus = (item) => {
    const date = item.date || "";
    const seasons = item.totalSeasons ?? 0;
    const status = item.status || "";

    return `Air Period: ${date} • Seasons: ${seasons} • Status: ${status}`;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <h3>{item.title}</h3>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <div className="details-body">
          <img src={poster} alt={item.title} className="details-poster" />
          <div className="details-info">
            <div className="meta">{formatMediaTypeAndGenre(item)}</div>
            <div className="meta">{formatDateSeasonsAndStatus(item)}</div>
            <div className="overview">{item.overview}</div>

            <label className="status-select">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>PLAN TO WATCH</option>
                <option>CURRENTLY WATCHING</option>
                <option>COMPLETED</option>
                <option>ON HOLD</option>
                <option>DROPPED</option>
              </select>
            </label>

            <div className="details-actions">
              <button 
                className="primary" 
                onClick={handleAdd}
                disabled={isAlreadyAdded}
              >
                {isAlreadyAdded ? "Already Added" : "Add Show"}
              </button>
              <button className="secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ShowDetailsModal.propTypes = {
  item: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  existingShows: PropTypes.arrayOf(PropTypes.object),
};

export default ShowDetailsModal;
