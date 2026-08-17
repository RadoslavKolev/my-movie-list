export function buildTmdbPosterPath(posterPath) {
  if (!posterPath) {
    return "https://placehold.co/500x750/1b0034/ffffff?text=No+Image";
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

export function normalizeTmdbResult(result) {
  return {
    id: `${result.media_type}-${result.id}`,
    tmdbId: result.id,
    media_type: result.media_type,
    title: result.title || result.name || "",
    overview: result.overview || "",
    poster_path: result.poster_path || result.backdrop_path || null,
    vote_average: result.vote_average || 0,
    date: result.first_air_date || result.last_air_date || "",
    totalEpisodes: result.number_of_episodes ?? 0,
  };
}

export async function searchTMDB(query) {
  if (!query?.trim()) return [];
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key) {
    console.warn("VITE_TMDB_API_KEY is not set — TMDB search will be disabled.");
    return [];
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${encodeURIComponent(
    query
  )}&page=1&include_adult=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("TMDB search failed:", res.status);
      return [];
    }

    const data = await res.json();
    const results = (data.results || []).map((result) => normalizeTmdbResult(result));
    return results.slice(0, 10);
  } catch (error) {
    console.error("TMDB search error:", error);
    return [];
  }
}

export async function getTMDBDetails(mediaType, tmdbId) {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key || !mediaType || !tmdbId) return null;

  const resource = mediaType === "movie" ? "movie" : "tv";
  const url = `https://api.themoviedb.org/3/${resource}/${tmdbId}?api_key=${key}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    return {
      tmdbId: data.id,
      media_type: mediaType,
      title: data.title || data.name || "",
      overview: data.overview || "",
      poster_path: data.poster_path || data.backdrop_path || null,
      vote_average: data.vote_average || 0,
      date: `${data.first_air_date} - ${data.last_air_date}`,
      totalEpisodes: data.number_of_episodes ?? 0,
      totalSeasons: data.number_of_seasons ?? 1,
      status: data.status || "",
      seasons: Array.isArray(data.seasons)
        ? data.seasons.filter(season => season.name !== "Specials") : [],
      genres: Array.isArray(data.genres)
        ? data.genres.map((genre) => ({ id: genre.id, name: genre.name }))
        : [],
    };
  } catch (error) {
    console.error("TMDB details error:", error);
    return null;
  }
}
