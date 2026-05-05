import React from "react";
import "./MoviesPage.css";
export function MoviesPage({ movies, openMovie }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => ( //loops through movies and creates a card for each movie with poster, title, rating, language and showtimes button that opens movie details when clicked
        <article className="poster-card" key={movie._id}>
          <button onClick={() => openMovie(movie)}>
            <img src={movie.poster} alt={movie.title} />
          </button>
          <h2>{movie.title}</h2>
          <div className="rating">{movie.rating}</div>
          <p><b>Language:</b> {movie.language}</p>
          <button className="primary" onClick={() => openMovie(movie)}>Showtimes</button>
        </article>
      ))}
    </div>
  );
}
