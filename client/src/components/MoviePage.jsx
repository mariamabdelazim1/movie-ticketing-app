import React from "react";
import { Crown } from "lucide-react";
import { formatDate, formatShowTime, money, youtubeEmbedUrl } from "../utils/format.js";
import "./MoviePage.css";

export function MoviePage({ movie, chooseShow, user }) {
  return (
    <div className="movie-detail-page">
      <div className="trailer-layout">
        <img className="detail-poster" src={movie.poster} alt={movie.title} />
        <iframe
          key={movie._id}
          className="trailer-frame"
          src={youtubeEmbedUrl(movie.trailerUrl)}
          title={`${movie.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <section className="detail-copy">
        <span className="tag">{movie.rating} · {movie.language} · {movie.duration} min</span>
        <h2>{movie.title}</h2>
        <p>{movie.synopsis}</p>
        <dl className="movie-meta">
          <div><dt>Genre</dt><dd>{movie.genre}</dd></div>
          <div><dt>Release Date</dt><dd>{formatDate(movie.releaseDate)}</dd></div>
          <div><dt>Subtitles</dt><dd>{movie.subtitles || "None"}</dd></div>
          <div><dt>Cast</dt><dd>{movie.cast?.join(", ")}</dd></div>
        </dl>
        <h3>Available Times</h3>
        <div className="show-grid">
          {movie.shows.map((show) => (
            <button key={show._id} className="show-chip" onClick={() => chooseShow(show._id)}>
              <span>{formatShowTime(show.startsAt)}</span>
              <strong>{show.auditorium}</strong>
              <small className={show.type === "gold" ? "gold" : ""}>
                {show.type === "gold" && <Crown size={14} />} {show.type} · {money(show.basePrice + show.goldSurcharge)}
              </small>
            </button>
          ))}
        </div>
        {!user && <div className="login-gate">Login or sign up is required before reserving seats.</div>}
      </section>
    </div>
  );
}
