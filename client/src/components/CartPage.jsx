import React from "react";
import { ReceiptText, Trash2 } from "lucide-react";
import { formatShowTime, money } from "../utils/format.js";
import { CartSummary } from "./CartSummary.jsx";
import "./CartPage.css";

export function CartPage({
  showDetails,
  selectedSeats,
  concessions,
  snacks,
  removeSeat,
  removeSnack,
  ticketTotal,
  snackTotal,
  cartTotal,
  rewardDiscountTotal,
  rewardRedemptions,
  rewardPointsSpent,
  clearRewards,
  reserveCart,
  saving
}) {
  const selectedSnacks = concessions.filter((item) => snacks[item._id] > 0);

  return (
    <div className="cart-page">
      <section className="panel">
        <h2><ReceiptText size={22} /> Review Reservation</h2>
        <p>{showDetails?.movie?.title} · {showDetails && formatShowTime(showDetails.startsAt)}</p>
        <h3>Seats</h3>
        {selectedSeats.length ? (
          <div className="cart-items">
            {selectedSeats.map((seat) => (
              <div className="cart-item" key={seat}>
                <span>Seat {seat}</span>
                <button className="icon-button" onClick={() => removeSeat(seat)} title={`Remove seat ${seat}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No seats selected</p>
        )}
        <h3>Snacks & Drinks</h3>
        {selectedSnacks.length ? (
          <div className="cart-items">
            {selectedSnacks.map((item) => (
              <div className="cart-item" key={item._id}>
                <span>{item.name} x {snacks[item._id]} · {money(item.price * snacks[item._id])}</span>
                <button className="icon-button" onClick={() => removeSnack(item._id)} title={`Remove ${item.name}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No food selected.</p>
        )}
      </section>
      <CartSummary
        selectedSeats={selectedSeats}
        ticketTotal={ticketTotal}
        snackTotal={snackTotal}
        cartTotal={cartTotal}
        rewardDiscountTotal={rewardDiscountTotal}
        rewardRedemptions={rewardRedemptions}
        rewardPointsSpent={rewardPointsSpent}
        clearRewards={clearRewards}
        action={<button className="primary wide" onClick={reserveCart} disabled={saving}>{saving ? "Reserving..." : "Reserve and Show Receipt"}</button>}
      />
    </div>
  );
}
