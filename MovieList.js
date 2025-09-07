import React from "react";
import MovieCard from "./MovieCard";

function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p style={{ textAlign: "center", color: "#aaa" }}>Aucun film trouvé.</p>;
  }

  return (
    <main className="movies-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </main>
  );
}

export default MovieList;
