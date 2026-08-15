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
    console.debug("TMDB search URL:", url);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("TMDB search failed:", res.status);
      return [];
    }
    const data = await res.json();
    const results = (data.results || []).map((r) => ({
      id: `${r.media_type}-${r.id}`,
      tmdbId: r.id,
      media_type: r.media_type,
      title: r.title || r.name || "",
      overview: r.overview || "",
      poster_path: r.poster_path || r.backdrop_path || null,
      vote_average: r.vote_average || 0,
      date: r.first_air_date || r.release_date || "",
    }));

    return results.slice(0, 10);
  } catch (e) {
    console.error("TMDB search error:", e);
    return [];
  }
}
