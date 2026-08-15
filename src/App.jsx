import ShowCard from "./components/ShowCard/ShowCard";

// Dummy data for testing
const shows = [
  {
    id: 1,
    title: "Breaking Bad",
    poster:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    rating: 9,
    episodesWatched: 32,
    totalEpisodes: 62,
    type: "TV",
  },

  {
    id: 2,
    title: "Better Call Saul",
    poster:
      "https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg",
    rating: 9,
    episodesWatched: 20,
    totalEpisodes: 63,
    type: "TV",
  },

  {
    id: 3,
    title: "The Last of Us",
    poster:
      "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    rating: 8,
    episodesWatched: 5,
    totalEpisodes: 9,
    type: "TV",
  },

  {
    id: 4,
    title: "Stranger Things",
    poster:
      "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    rating: 9,
    episodesWatched: 12,
    totalEpisodes: 34,
    type: "TV",
  },

  {
    id: 5,
    title: "Game of Thrones",
    poster:
      "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    rating: 0,
    episodesWatched: 73,
    totalEpisodes: 73,
    type: "TV",
  },
];

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-content">
          <div className="logo">
            MyMovie<span>List</span>
          </div>

          <nav className="navigation">
            <button>ALL</button>
            <button className="active">CURRENTLY WATCHING</button>
            <button>COMPLETED</button>
            <button>ON HOLD</button>
            <button>DROPPED</button>
            <button>PLAN TO WATCH</button>
          </nav>
        </div>
      </header>

      <main className="content">
        <h1>Currently Watching</h1>
        <div className="shows-grid">
          {shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;