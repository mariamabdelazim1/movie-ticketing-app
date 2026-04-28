import { ShoppingCart } from "lucide-react";
import { formatShowTime } from "../utils/format.js";
import { CartSummary } from "./CartSummary.jsx";
import { SnackPicker } from "./SnackPicker.jsx";
import "./SeatFoodPage.css";

export function SeatFoodPage(props) {
  const {
    showDetails,
    selectedSeats,
    toggleSeat,
    concessions,
    snacks,
    changeSnack,
    setPage,
    ticketTotal,
    snackTotal,
    cartTotal,
    rewardDiscountTotal,
    rewardRedemptions,
    rewardPointsSpent,
    clearRewards
  } = props;

  return (
    <div className="booking-layout">
      <section className="panel">
        <h2>{showDetails?.movie?.title}</h2>
        <p>{showDetails ? `${formatShowTime(showDetails.startsAt)} · ${showDetails.auditorium}` : "Choose a showtime first."}</p>
        <div className="screen">Screen</div>
        <div className={`seat-map ${showDetails?.type === "gold" ? "gold-map" : ""}`}>
          {showDetails?.seats.map((seat) => (
            <button
              key={seat.id}
              className={`seat ${seat.status} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
              disabled={seat.status === "booked"}
              onClick={() => toggleSeat(seat)}
            >
              {seat.id}
            </button>
          ))}
        </div>
      </section>
      <SnackPicker concessions={concessions} snacks={snacks} changeSnack={changeSnack} />
      <CartSummary
        selectedSeats={selectedSeats}
        ticketTotal={ticketTotal}
        snackTotal={snackTotal}
        cartTotal={cartTotal}
        rewardDiscountTotal={rewardDiscountTotal}
        rewardRedemptions={rewardRedemptions}
        rewardPointsSpent={rewardPointsSpent}
        clearRewards={clearRewards}
        action={<button className="primary wide" onClick={() => setPage("cart")}><ShoppingCart size={18} /> View Cart</button>}
      />
    </div>
  );
}
