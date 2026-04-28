import { canCancelBooking, formatShowTime, money } from "../utils/format.js";
import "./BookingsPage.css";

export function BookingsPage({ bookings, cancelBooking }) {
  return (
    <div className="list-page">
      {bookings.length ? bookings.map((booking) => (
        <article className={`booking-row ${booking.status === "cancelled" ? "cancelled" : ""}`} key={booking._id}>
          <img src={booking.show.movie.poster} alt="" />
          <div>
            <h2>{booking.show.movie.title}</h2>
            <p>{formatShowTime(booking.show.startsAt)} · Seats {booking.seats.join(", ")}</p>
            <p>Status: {booking.status || "active"}</p>
          </div>
          <div className="booking-actions">
            <strong>{money(booking.pricing.total)}</strong>
            {canCancelBooking(booking) && (
              <button className="danger small-btn" onClick={() => cancelBooking(booking._id)}>
                Cancel
              </button>
            )}
          </div>
        </article>
      )) : <section className="panel">No bookings yet.</section>}
    </div>
  );
}
