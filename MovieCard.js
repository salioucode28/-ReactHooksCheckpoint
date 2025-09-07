import React from "react";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getStars(vote) {
  const stars = Math.round(vote) / 2;
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : "https://via.placeholder.com/300x450/222/fff?text=No+Image";

  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={poster} alt={movie.title} />
        <div className="movie-overlay">
          <button className="play-button">▶</button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          <span className="stars">{getStars(movie.vote_average)}</span>
          <span className="rating-number">{movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
