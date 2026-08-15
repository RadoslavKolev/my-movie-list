export function getEpisodeDefaults(item, status) {
  const isMovie = item.media_type === "movie";
  const isCompleted = status === "COMPLETED";

  let episodesWatched = 0;
  if (isMovie) {
    episodesWatched = isCompleted ? 1 : 0;
  } else if (isCompleted) {
    episodesWatched = item.totalEpisodes || 0;
  }

  return {
    totalEpisodes: isMovie ? 1 : item.totalEpisodes || 0,
    episodesWatched,
  };
}
