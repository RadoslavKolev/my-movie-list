import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);

function buildRecordId(userId, showId) {
  return `${userId}:${String(showId)}`;
}

async function getCurrentUserId() {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export async function syncShowsToSupabase(shows) {
  if (!supabase || !Array.isArray(shows) || shows.length === 0) {
    return { ok: true, skipped: true };
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: true, skipped: true };
  }

  const normalizedShows = shows.map((show) => ({
    id: buildRecordId(userId, show.id),
    user_id: userId,
    title: show.title,
    poster: show.poster,
    rating: Number(show.rating ?? 0),
    show_rating: show.overallRating,
    episodesWatched: Number(show.episodesWatched ?? 0),
    totalEpisodes: Number(show.totalEpisodes ?? 1),
    type: show.type || "TV",
    status: show.status || "PLAN TO WATCH",
    overview: show.overview ?? "",
    show_status: show.showStatus ?? "",
    show_air_period: show.airingPeriod,
    genres: Array.isArray(show.genres) ? show.genres : [],
    seasons: Array.isArray(show.seasons) ? show.seasons : [],
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("shows")
    .upsert(normalizedShows, { onConflict: "id" });

  if (error) {
    console.error("Supabase save failed:", error);
    return { ok: false, error };
  }

  return { ok: true, skipped: false };
}

export async function fetchShowsFromSupabase() {
  if (!supabase) {
    return [];
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("shows")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch failed:", error);
    return [];
  }

  return data.map((show) => ({
    id: show.id.replace(`${userId}:`, ""),
    title: show.title,
    poster: show.poster,
    rating: show.rating ?? 0,
    overallRating: show.show_rating,
    airingPeriod: show.show_air_period,
    episodesWatched: show.episodesWatched ?? 0,
    totalEpisodes: show.totalEpisodes ?? 1,
    type: show.type || "TV",
    status: show.status || "PLAN TO WATCH",
    overview: show.overview ?? "",
    showStatus: show.show_status ?? "",
    genres: Array.isArray(show.genres) ? show.genres : [],
    seasons: Array.isArray(show.seasons) ? show.seasons : [],
  }));
}
