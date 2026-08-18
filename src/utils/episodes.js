import { buildTmdbPosterPath } from "../api/tmdb";

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

// A "Specials" season (season_number 0, or named "Specials") should never get its own card.
// New shows are already filtered at fetch time,
// but shows saved before that filter existed may still have one stored, so we filter defensively here too.
function isSpecialSeason(season) {
  return season.season_number === 0 || /specials/i.test(season.name || "");
}

export function sumEpisodesWatched(seasons) {
  return seasons.reduce((sum, season) => sum + (season.episodesWatched ?? 0), 0);
}

export function sumTotalEpisodes(seasons) {
  return seasons.reduce((sum, season) => sum + (season.episode_count ?? 0), 0);
}

// Real (non-special) seasons for a show, sorted, each with its own
// episodesWatched and status. Older saved shows only ever tracked a single
// aggregate episodesWatched count and a single status on the show itself,
// so for any season that doesn't yet have its own value we backfill it:
// status copies the show's old status, and episodesWatched is "waterfalled"
// from the show's old aggregate across seasons in order (fill season 1
// first, then season 2, etc.) so existing progress isn't lost the first
// time this runs.
export function getSeasonsWithProgress(show) {
  const seasons = (show.seasons || [])
    .filter((season) => !isSpecialSeason(season))
    .slice()
    .sort((a, b) => (a.season_number ?? 0) - (b.season_number ?? 0));

  const needsBackfill = seasons.some(
    (season) =>
      season.episodesWatched === undefined ||
      season.status === undefined ||
      season.rating === undefined
  );
  if (!needsBackfill) {
    return seasons;
  }

  let remaining = show.episodesWatched ?? 0;
  return seasons.map((season) => {
    const withStatus =
      season.status !== undefined
        ? season
        : { ...season, status: show.status || "PLAN TO WATCH" };

    const withRating =
      withStatus.rating !== undefined
        ? withStatus
        : { ...withStatus, rating: show.rating ?? 0 };

    if (withRating.episodesWatched !== undefined) {
      return withRating;
    }

    const watched = Math.max(0, Math.min(withRating.episode_count ?? 0, remaining));
    remaining -= watched;
    return { ...withRating, episodesWatched: watched };
  });
}

function buildSeasonTitle(showTitle, seasonName, totalSeasons) {
  if (totalSeasons === 1) {
    return showTitle;
  }
  return seasonName.startsWith(showTitle) ? seasonName : `${showTitle}: ${seasonName}`;
}

// Card(s) to render for a single show. TV shows get one card per
// (non-special) season; movies and any show without a season breakdown
// keep the original single-card behavior.
export function buildShowCards(show) {
  const seasons = getSeasonsWithProgress(show);

  if (seasons.length === 0) {
    return [
      {
        id: show.id,
        showId: show.id,
        seasonNumber: null,
        poster: show.poster,
        title: show.title,
        rating: show.rating,
        episodesWatched: show.episodesWatched ?? 0,
        totalEpisodes: show.totalEpisodes ?? 0,
        type: show.type,
        status: show.status,
        overview: show.overview,
        genres: show.genres,
      },
    ];
  }

  const totalSeasons = seasons.length;

  return seasons.map((season) => ({
    id: `${show.id}::season-${season.season_number}`,
    showId: show.id,
    seasonNumber: season.season_number,
    poster: season.poster_path ? buildTmdbPosterPath(season.poster_path) : show.poster,
    title: buildSeasonTitle(show.title, season.name, totalSeasons),
    rating: season.rating,
    episodesWatched: season.episodesWatched ?? 0,
    totalEpisodes: season.episode_count ?? 0,
    type: show.type,
    status: season.status,
    overview: season.overview || show.overview,
    genres: show.genres,
  }));
}

// Reverses the id built above so an update coming from a card can be
// routed back to the right show (and, if applicable, the right season).
export function parseCardId(cardId) {
  const match = /^(.*)::season-(\d+)$/.exec(cardId);
  if (!match) {
    return { showId: cardId, seasonNumber: null };
  }
  return { showId: match[1], seasonNumber: Number(match[2]) };
}
