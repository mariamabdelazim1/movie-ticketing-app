import React from "react";
import { formatShowTime, money } from "../utils/format.js";
import "./ReceiptPage.css";

export function ReceiptPage({ receipt }) {
  if (!receipt) return <section className="panel">No receipt yet.</section>;
  const isSnackOnly = Boolean(receipt.snackOrder);
  const data = isSnackOnly ? receipt.snackOrder : receipt;

  return (
    <section className="receipt panel">
      <h2>Receipt</h2>
      {isSnackOnly ? (
        <>
          <p>Snack order confirmed.</p>
          <p>Total: {money(data.total)}</p>
          <p>Points earned: {data.pointsEarned}</p>
        </>
      ) : (
        <>
          <p>{data.show.movie.title}</p>
          <p>{formatShowTime(data.show.startsAt)}</p>
          <p>Seats: {data.seats.join(", ")}</p>
          {data.rewardsRedeemed?.length > 0 && <p>Rewards: {data.rewardsRedeemed.join(", ")}</p>}
          {(data.pricing.ticketDiscount > 0 || data.pricing.concessionDiscount > 0) && (
            <p>Reward savings: {money((data.pricing.ticketDiscount || 0) + (data.pricing.concessionDiscount || 0))}</p>
          )}
          <p>Total: {money(data.pricing.total)}</p>
          <p>Points earned: {Math.floor(data.pricing.total / 10)}</p>
        </>
      )}
    </section>
  );
}
