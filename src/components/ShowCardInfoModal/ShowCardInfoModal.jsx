import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./ShowCardInfoModal.scss";

const statusOptions = [
  "CURRENTLY WATCHING",
  "COMPLETED",
  "ON HOLD",
  "DROPPED",
  "PLAN TO WATCH",
];

function ShowCardInfoModal({ show, onClose, onSave }) {
  const [formState, setFormState] = useState(() => ({
    title: show?.title || "",
    rating: show?.rating ?? 0,
    status: show?.status || "PLAN TO WATCH",
    episodesWatched: show?.episodesWatched ?? 0,
    totalEpisodes: show?.totalEpisodes ?? 1,
    type: show?.type || "TV",
  }));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!show) return null;

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

  const progressPercent =
    formState.totalEpisodes > 0
      ? (formState.episodesWatched / formState.totalEpisodes) * 100
      : 0;

  const progressBarColor = getProgressBarColor(formState.status);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((prev) => {
      const nextValue = name === "rating" ? Number(value) : value;

      if (name === "status" && nextValue === "COMPLETED") {
        return {
          ...prev,
          status: nextValue,
          episodesWatched: prev.totalEpisodes,
        };
      }

      return {
        ...prev,
        [name]: nextValue,
      };
    });
  };

  const handleProgressChange = (change) => {
    setFormState((prev) => {
      const nextValue = Math.max(
        0,
        Math.min(prev.totalEpisodes, Number(prev.episodesWatched) + change)
      );

      return {
        ...prev,
        episodesWatched: nextValue,
      };
    });
  };

  const handleSave = () => {
    onSave({
      ...show,
      title: formState.title,
      rating: Number(formState.rating),
      status: formState.status,
      episodesWatched: Math.max(
        0,
        Math.min(formState.totalEpisodes, Number(formState.episodesWatched))
      ),
      totalEpisodes: Math.max(1, Number(formState.totalEpisodes)),
      type: formState.type,
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      role="presentation"
      tabIndex={-1}
    >
      <div
        className="show-card-modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-poster-wrap">
          <img src={show.poster} alt={show.title} className="modal-poster" />
        </div>

        <div className="modal-content">
          <div className="modal-header-row">
            <div>
              <div className="modal-badge">{formState.type}</div>
              <h2>{formState.title}</h2>
            </div>

            <button type="button" className="rating-button">
              {formState.rating > 0 ? `⭐ ${formState.rating}` : "★ Rate"}
            </button>
          </div>

          <div className="modal-meta-row">
            <span>{formState.type}</span>
            <span>•</span>
            <span>{show.genre || "Drama"}</span>
            <span>•</span>
            <span>{formState.totalEpisodes} episodes</span>
          </div>

          <div className="progress-summary">
            <div className="progress-summary__label">Progress</div>
          </div>

          <div className="progress-controls">
            <button
              type="button"
              className="progress-button"
              disabled={formState.episodesWatched <= 0}
              onClick={() => handleProgressChange(-1)}
            >
              −
            </button>

            <div className="progress-count">
              {formState.episodesWatched} / {formState.totalEpisodes}
            </div>

            <button
              type="button"
              className="progress-button"
              disabled={formState.episodesWatched >= formState.totalEpisodes}
              onClick={() => handleProgressChange(1)}
            >
              +
            </button>
          </div>

          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{
                width: `${progressPercent}%`,
                background: progressBarColor,
              }}
            />
          </div>

          <div className="overview-block">
            <h3>Overview</h3>
            <p>
              {show.overview ||
                "A compelling story with memorable characters and a deeply engaging progression that keeps viewers invested from start to finish."}
            </p>
          </div>

          <div className="detail-grid">
            <label className="field-group">
              <span>Rating</span>
              <select name="rating" value={formState.rating} onChange={handleChange}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <option key={value} value={value}>
                    {value === 0 ? "N/A" : value}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Status</span>
              <select name="status" value={formState.status} onChange={handleChange}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Close
            </button>
            <button type="button" className="primary-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ShowCardInfoModal.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    rating: PropTypes.number,
    episodesWatched: PropTypes.number,
    totalEpisodes: PropTypes.number,
    type: PropTypes.string,
    status: PropTypes.string,
    overview: PropTypes.string,
    genre: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ShowCardInfoModal;
