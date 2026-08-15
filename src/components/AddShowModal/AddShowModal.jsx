import { useState } from "react";
import PropTypes from "prop-types";
import "./AddShowModal.scss";

const defaultForm = {
  title: "",
  poster: "",
  type: "TV",
  status: "CURRENTLY WATCHING",
  rating: "",
  episodesWatched: "",
  totalEpisodes: "",
};

function AddShowModal({ isOpen, onClose, onSubmit, statusOptions }) {
  const [formData, setFormData] = useState(defaultForm);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOverlayKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) return;

    onSubmit({
      id: Date.now(),
      title: formData.title.trim(),
      poster:
        formData.poster.trim() ||
        "https://placehold.co/500x750/1b0034/ffffff?text=TV+Show",
      rating: Number(formData.rating) || 0,
      episodesWatched: Number(formData.episodesWatched) || 0,
      totalEpisodes: Number(formData.totalEpisodes) || 0,
      type: formData.type,
      status: formData.status,
    });

    setFormData(defaultForm);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={handleOverlayKeyDown}
      role="presentation"
      tabIndex={0}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-show-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleOverlayKeyDown}
        tabIndex={0}
      >
        <div className="modal-header">
          <h2 id="add-show-title">Add TV Show</h2>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: The Bear"
              required
            />
          </label>

          <label>
            Poster URL
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              placeholder="https://...jpg"
            />
          </label>

          <div className="form-row">
            <label>
              Type
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="TV">TV</option>
                <option value="Movie">Movie</option>
                <option value="Anime">Anime</option>
                <option value="Special">Special</option>
              </select>
            </label>

            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Rating
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="8.8"
              />
            </label>

            <label>
              Episodes watched
              <input
                type="number"
                min="0"
                name="episodesWatched"
                value={formData.episodesWatched}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Total episodes
            <input
              type="number"
              min="0"
              name="totalEpisodes"
              value={formData.totalEpisodes}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Show
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddShowModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AddShowModal;
