import React from "react";
import { money } from "../utils/format.js";
import { SnackPicker } from "./SnackPicker.jsx";
import "./CartSummary.css";
import "./SnacksPage.css";

export function SnacksPage({
  concessions,
  snacks,
  changeSnack,
  snackTotal,
  rewardDiscountTotal,
  rewardRedemptions,
  rewardPointsSpent,
  clearRewards,
  buySnacksOnly,
  saving
}) {
  const hasSnacks = Object.values(snacks).some((quantity) => quantity > 0);

  return (
    <div className="snacks-page">
      <SnackPicker concessions={concessions} snacks={snacks} changeSnack={changeSnack} />
      <aside className="summary">
        <h2>Snack Order</h2>
        {rewardPointsSpent > 0 && <p>Points spent: {rewardPointsSpent}</p>}
        {rewardDiscountTotal > 0 && <p>Reward savings: -{money(rewardDiscountTotal)}</p>}
        <dl><div className="total"><dt>Total</dt><dd>{money(snackTotal)}</dd></div></dl>
        {rewardRedemptions.freePopcorn && (
          <button className="secondary wide" onClick={clearRewards}>Remove rewards</button>
        )}
        <button className="primary wide" onClick={buySnacksOnly} disabled={saving || !hasSnacks}>
          {saving ? "Ordering..." : "Buy Snacks"}
        </button>
      </aside>
    </div>
  );
}
