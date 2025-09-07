import React, { useState, useEffect } from "react";
import "./App.css";

const TMDB_API_KEY = "fd06120cbae486a0b6ac8d55fa86862b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Convertir note sur 10 en étoiles sur 5
function getStars(vote) {
  const stars = Math.round(vote) / 2;
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// Composant Carte Film
function MovieCard({ movie, onPlay }) {
  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : "https://via.placeholder.com/300x450/222/fff?text=No+Image";

  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={poster} alt={movie.title} />
        <div className="movie-overlay">
          <button className="play-button" onClick={() => onPlay(movie.id)}>
            ▶
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          <span className="stars">{getStars(movie.vote_average)}</span>
          <span className="rating-number">
            {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}

// Composant Popup Bande-Annonce
function TrailerPopup({ url, onClose }) {
  if (!url) return null;

  return (
    <div
      className="trailer-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80%",
          maxWidth: "900px",
          aspectRatio: "16/9",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "12px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 10000,
          }}
        >
          ✖
        </button>
        <iframe
          src={url}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Trailer"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
        ></iframe>
      </div>
    </div>
  );
}

// Composant principal App
function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [trailerUrl, setTrailerUrl] = useState(null);

  // Affiche films populaires au chargement
  useEffect(() => {
    fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch(() => setMovies([]));
  }, []);

  // Recherche des films
  const searchMovies = () => {
    if (!query.trim()) return;
    fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch(() => setMovies([]));
  };

  // Récupère la bande-annonce
  const playTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
      else alert("Aucune bande-annonce disponible 😢");
    } catch {
      alert("Erreur lors de la récupération de la bande-annonce 😢");
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="logo">VibeFlix</h1>
      </header>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher des films..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchMovies()}
          />
          <button className="search-button" onClick={searchMovies}>
            🔍
          </button>
        </div>
      </div>

      <main className="movies-grid">
        {movies.length
          ? movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onPlay={playTrailer} />
            ))
          : <p style={{ gridColumn: "1/-1", color: "#aaa", textAlign: "center" }}>Aucun film trouvé.</p>
        }
      </main>

      <TrailerPopup url={trailerUrl} onClose={() => setTrailerUrl(null)} />
    </div>
  );
}





export default App;
