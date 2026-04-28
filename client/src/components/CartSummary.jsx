import React from "react";
import { ShoppingCart } from "lucide-react";
import { money } from "../utils/format.js";
import "./CartSummary.css";

export function CartSummary({
  selectedSeats,
  ticketTotal,
  snackTotal,
  cartTotal,
  rewardDiscountTotal = 0,
  rewardRedemptions = {},
  rewardPointsSpent = 0,
  clearRewards,
  action
}) {
  const activeRewards = [
    rewardRedemptions.freePopcorn && "Free popcorn",
    rewardRedemptions.ticketDiscount && "10% ticket discount",
    rewardRedemptions.freeTicket && "Free ticket"
  ].filter(Boolean);

  return (
    <aside className="summary">
      <h2><ShoppingCart size={20} /> Cart</h2>
      <dl>
        <div><dt>Seats</dt><dd>{selectedSeats.join(", ") || "None"}</dd></div>
        {activeRewards.length > 0 && <div><dt>Rewards</dt><dd>{activeRewards.join(", ")}</dd></div>}
        {rewardPointsSpent > 0 && <div><dt>Points spent</dt><dd>{rewardPointsSpent}</dd></div>}
        {rewardDiscountTotal > 0 && <div><dt>Reward savings</dt><dd>-{money(rewardDiscountTotal)}</dd></div>}
        <div><dt>Tickets</dt><dd>{money(ticketTotal)}</dd></div>
        <div><dt>Food</dt><dd>{money(snackTotal)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{money(cartTotal)}</dd></div>
      </dl>
      {activeRewards.length > 0 && (
        <button className="secondary wide clear-rewards" onClick={clearRewards}>
          Remove rewards
        </button>
      )}
      {action}
    </aside>
  );
}
