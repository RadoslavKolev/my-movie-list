import PropTypes from "prop-types";
import { useState } from "react";
import "./ShowDetailsModal.scss";
import { getEpisodeDefaults } from "../../utils/episodes";

function ShowDetailsModal({ item, isOpen, onClose, onAdd }) {
  const [status, setStatus] = useState("PLAN TO WATCH");

  if (!isOpen || !item) return null;

  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://placehold.co/500x750/1b0034/ffffff?text=No+Image";

  const handleAdd = () => {
    const episodeDefaults = getEpisodeDefaults(item, status);

    const newShow = {
      id: `tmdb-${item.tmdbId}`,
      title: item.title,
      poster,
      rating: 0,
      episodesWatched: episodeDefaults.episodesWatched,
      totalEpisodes: episodeDefaults.totalEpisodes,
      type: item.media_type === "movie" ? "Movie" : "TV",
      status,
    };
    onAdd(newShow);
    onClose();
  };

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
            <div className="meta">{item.media_type.toUpperCase()} • {item.date}</div>
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
              <button className="primary" onClick={handleAdd}>Add Show</button>
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
};

export default ShowDetailsModal;
