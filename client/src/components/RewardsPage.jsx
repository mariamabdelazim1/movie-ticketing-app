import React from "react";
import { Gift } from "lucide-react";
import { AuthPrompt } from "./AuthPrompt.jsx";
import "./RewardsPage.css";

export function RewardsPage({ user, redeemReward, rewardRedemptions = {} }) {
  if (!user) return <AuthPrompt />;
  const rewards = [
    { key: "freePopcorn", points: 500, label: "Free regular popcorn" },
    { key: "ticketDiscount", points: 1000, label: "10% discount on tickets" },
    { key: "freeTicket", points: 1800, label: "Free ticket" }
  ];
  const unlockedRewards = rewards.filter((reward) => user.points >= reward.points);
  const nextReward = rewards.find((reward) => user.points < reward.points);

  return (
    <section className="panel">
      <h2><Gift size={22} /> Your Rewards</h2>
      <p className="big-points">{user.points} points</p>
      <div className="current-rewards">
        <h3>Current Rewards</h3>
        {unlockedRewards.length ? (
          unlockedRewards.map((reward) => <span key={reward.label}>{reward.label}</span>)
        ) : (
          <p>No rewards unlocked yet.</p>
        )}
      </div>
      {nextReward && (
        <p className="next-reward">
          Next: {nextReward.label} after {nextReward.points - user.points} more points
        </p>
      )}
      <div className="reward-grid">
        {rewards.map((reward) => (
          <article className={user.points >= reward.points ? "reward unlocked" : "reward"} key={reward.label}>
            <strong>{reward.label}</strong>
            <span>{reward.points} points</span>
            <small>{user.points >= reward.points ? "Unlocked" : `${reward.points - user.points} points to go`}</small>
            {user.points >= reward.points && (
              <button
                className="primary"
                disabled={rewardRedemptions[reward.key]}
                onClick={() => redeemReward(reward.key)}
              >
                {rewardRedemptions[reward.key] ? "Added to cart" : "Redeem"}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
